import { body, validationResult } from 'express-validator';

export const validate=(req ,res , next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
         return next();
	}
    const extracterror = [];
    errors.array().map((err)=>extracterror.push(`${err.msg}`));
    const errormsg = extracterror.join(', ');
    return res.status(400).json({
        sucess :false,
        message:"validation error",
        error : errormsg
    })
    
}
export const codeValidation = () => {
	return [
		body('code')
			.trim()
			.notEmpty()
			.withMessage('Code is required')
			.bail()
			.isString()
			.withMessage('Code must be a string'),
		body('language')
			.trim()
			.notEmpty()
			.withMessage('Language is required')
			.bail()
			.isString()
			.withMessage('Language must be a string')
	]
}