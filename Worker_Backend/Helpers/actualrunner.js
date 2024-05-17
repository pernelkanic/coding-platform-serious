
import { execSync } from "child_process";
import { promises as fs } from "fs";
import nodeCmd from 'node-cmd';
import { v4 as uuid } from "uuid";
class ActualRunner{
    constructor(){
        this.LANGUAGES={
            py: {
				dockerImage: 'python:3.9-slim',
				command: (filename) => `python ${filename} < tc.txt`
			},
			js: {
				dockerImage: 'node:14-alpine',
				command: (filename) => `node ${filename} < tc.txt; rm ${filename}`
			},
			cpp: {
				dockerImage: 'gcc:9.2.0',
				command: (filename) =>
                        `g++ ${filename} -o output && { ./output < tc.txt; exitcode=$?; } || exitcode=$?; rm -f ${filename} output; exit $exitcode`
			},
			java: {
				dockerImage: 'openjdk:11',
				command: (filename) => {
					const className = filename.split('.').slice(0, -1).join('.')
					return `javac ${filename} && java ${className} < tc.txt`
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
            nodeCmd.run(dockerCommand , (error , stdout , stderr)=>{ //node cmd is in case of windows have to change it to exec for bash 
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
    async  runnerCode(code , language){
        
        const {dockerImage, command} = this.getLangDetails(language);
        const filename = `${uuid()}.${language}`
        try{

            // await fs.writeFile(filename, code);
            // let data = await fs.readFile(filename, 'utf8');
            // data = data.replace(/\n/g, '');
            await fs.writeFile(filename, code);
            
           
               
            
              
                
                let currentDir = execSync('cd').toString().trim();
                currentDir = currentDir.replaceAll(" " , "\\")
                
                const dockerCommand = `docker run  -v "%cd%":/usr/src/app -w /usr/src/app ${dockerImage} /bin/sh -c "${command(filename)}"`;
              
                
              
            
              const{stdout, stderr} = await this.execCommand(dockerCommand);
                return {stdout, stderr};
        }catch(e){
            console.log(e);
            return e;
        }
    }
}
export default ActualRunner