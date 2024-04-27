
import dotenv from 'dotenv';
import rabbit from './Helpers/rabbit.js';
import redisClient from './Helpers/redis.js';
dotenv.config();

const workerRun = async()=>{
    try{
        console.log("the worker is on");
        await rabbit.connect();
        
  
        await rabbit.consume('codequeue' , async(msg ,message)=>{
            try{
                console.log("consuming message");
                if(message ==null){
                    console.log("the message is null");
                    return;
                }
                const{id , code , language}= message;
                const output = {
					
					status: 'completed'
				}
			
				await redisClient.set(id, JSON.stringify(output));
                
            }
            catch(e){
                console.log("the error occured in the queue section" , e);
            }
          
        } ,  { noAck: false })

    }
    catch(e){
        console.log("the error has occured" , e);
    }
}
workerRun();