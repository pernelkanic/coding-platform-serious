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
        const data = jose.jwtVerify(actualtoken, JWKS);
        next();
    }
    catch(e){
        res.status(400).json({
            error:"This is not a valid token",
            message:e
        })
        return;
    }

}
