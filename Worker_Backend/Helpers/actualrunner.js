
import { exec, execSync } from "child_process";
import { log } from "console";
import { promises as fs } from "fs";
import nodeCmd from 'node-cmd';
import { v4 as uuid } from "uuid";
class ActualRunner{
    constructor(){
        this.LANGUAGES={
            py: {
				dockerImage: 'python:3.9-slim',
				command: (filename) => `python ${filename} < input.txt ;`
			},
			js: {
				dockerImage: 'node:14-alpine',
				command: (filename) => `node ${filename} < input.txt; rm ${filename}`
			},
			cpp: {
				dockerImage: 'gcc:9.2.0',
				command: (filename) =>
                        `g++ ${filename} -o output && { ./output < input.txt; exitcode=$?; } || exitcode=$?; rm -f ${filename} output; exit $exitcode`
			},
			java: {
				dockerImage: 'openjdk:11',
				command: (filename) => {
					const className = filename.split('.').slice(0, -1).join('.')
					return `javac ${filename} && java ${className} < input.txt`
				}
			}
		}
        
    }
    getLangDetails(language){
        const details = this.LANGUAGES[language];
        
        if(!details){
            throw new Error("Unsupported Error");
        }
        return details
    }
    execCommand(dockerCommand){
        return new Promise((resolve, reject)=>{
            exec(dockerCommand , (error , stdout , stderr)=>{ //node cmd is in case of windows have to change it to exec for bash 
                if(error){
                    reject({
                        error:error.message,
                        message:"unexpected system error fuck you !",

                    })
                    return 
                }
                resolve({stdout , stderr});
                
            })
        })
    }
    async  runnerCode(code , language , id){
        
        const {dockerImage, command} = this.getLangDetails(language);
        let filename = `${uuid()}.${language}`
    
        const currentDir = process.cwd();
        if(language == 'java'){
            filename = `Main.${language}`
        }
        try{

            // await fs.writeFile(filename, code);
            // let data = await fs.readFile(filename, 'utf8');
            // data = data.replace(/\n/g, '');
            await fs.writeFile(filename, code);
            
            let currentDir = execSync('pwd').toString().trim();
            
                
                const dockerCommand = `docker run  -v ${currentDir}:/usr/src/app -w /usr/src/app ${dockerImage} /bin/sh -c "${command(filename)}"`;
              const{stdout, stderr} = await this.execCommand(dockerCommand);
          
                return {stdout, stderr};
        }catch(e){
           throw e;

           
        }
    }
}
export default ActualRunner
