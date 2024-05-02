import * as jose from 'jose';

export async function userValidation(req, res, next){
    const verifykey = process.env.CLERK_PEM_KEY;
    const {authorization} = req.headers;
  
    if(authorization === undefined){
        res.status(500).json({
            error :"The user is not signed in"
        })
        return;
    }
    const actualtoken = authorization.split(' ')[1];
    const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.CLERK_PEM_URL}`))
    try{
        const data = await jose.jwtVerify(actualtoken, JWKS,(err,userId)=>{
            if(err){
                 res.status(400).json({
                    error:"This is not a valid token",
                    
                })
            }
            
        });
       
        next();
   
    }
    catch(e){
        return res.status(400).json({
            error:"This is not a valid token",
            
        })
        return;
    }

}
