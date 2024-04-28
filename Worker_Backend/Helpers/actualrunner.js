
import { exec } from "child_process";
import { promises as fs } from "fs";
import { v4 as uuid } from "uuid";
class ActualRunner{
    constructor(){
        this.LANGUAGES={
            py: {
				dockerImage: 'python:3.9-slim',
				command: (filename) => `python ${filename}; rm ${filename}`
			},
			js: {
				dockerImage: 'node:14-alpine',
				command: (filename) => `node ${filename}; rm ${filename}`
			},
			cpp: {
				dockerImage: 'gcc:9.2.0',
				command: (filename , input) =>
					`g++ ${filename} -o output && { ./output < testcase.txt; exitcode=$?; } || exitcode=$?; rm -f ${filename} output; exit $exitcode`
			},
			java: {
				dockerImage: 'openjdk:11',
				command: (filename ) => {
					const className = filename.split('.').slice(0, -1).join('.')
					return `javac ${filename} && java ${className}`
				}
			}
		}
        
    }
    getLangDetails(language){
        const details = this.LANGUAGES[language];
        console.log("the details of the image is " , details.dockerImage);
        if(!details){
            throw new Error("Unsupported Error");
        }
        return details
    }
    execCommand(dockerCommand){
        return new Promise((resolve, reject)=>{
            exec(dockerCommand , (error , stdout , stderr)=>{
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
            await fs.writeFile(filename, code);
            
            const dockerCommand = `docker run  -v  cd:/usr/src/app -w /usr/src/app ${dockerImage} /bin/sh -c "${command(filename)}" `;
          
            const{stdout, stderr} = await this.execCommand(dockerCommand);
            return {stdout, stderr};

        }catch(e){
            console.log(e);
            return e;
        }
    }
}
export default ActualRunner