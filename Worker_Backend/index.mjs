
import dotenv from 'dotenv';
import ActualRunner from './Helpers/actualrunner.js';
import rabbit from './Helpers/rabbit.js';
import redisClient from './Helpers/redis.js';
import tcs from './testcase.mjs';
import { readFileSync } from 'fs';

dotenv.config();
const runner = new ActualRunner();

const workerRun = async()=>{
    try{
        console.log("the worker is on");
        await rabbit.connect();
        
        const { channel } = rabbit
		await rabbit.channel.assertQueue('codequeue')
        await rabbit.consume('codequeue' , async(msg ,message)=>{
            try{
                console.log("consuming message");
                if(message ==null){
                    console.log("the message is null");
                    return;
                }
                const{id , code , language}= message;
                const {stdout , stderr} = await runner.runnerCode(code ,language, id);
                
                const result = stdout? stdout : stderr;
                let output = readFileSync('./output.txt', 'utf8');
               
                const normalize = (str) => str.replace(/\r\n/g, '\n').trim();

                const normalizedResult = normalize(result);
                const normalizedOutput = normalize(output);
                  console.log(typeof(result))
                  if(normalizedResult === normalizedOutput){
                      const outputres ={
                      status:"accepted",
                      Actual:result,
                      Expected:output
                  }
                  
                    await redisClient.set(id, JSON.stringify(outputres));
                    return;
                }

              
              else if(normalizedResult != normalizedOutput){ 
                const outputerr = {
                    status: "rejected",
                    Actual: result,
                    Expected: output
                }
               await redisClient.set(id, JSON.stringify(outputerr));
               return;
            }
            
            }
            catch(e){
                const{id , code , language}= message;
                const output = {
                    status: "Error",
                    message: e
                }
                await redisClient.set(id, JSON.stringify(output));
                return;
            }
          
        } ,  { noAck: false })

    }
    catch(e){
        console.log("the error has occured" , e);
    }
}
workerRun();
