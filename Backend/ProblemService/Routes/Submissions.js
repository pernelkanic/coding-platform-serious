import express from 'express';
import { getSubmissionById, runCode, submitCode, } from '../Controllers/SubmissionController.js';
import { userValidation } from '../Middlewares/UserValidation.js';
import { codeValidation, validate } from '../Middlewares/Validator.js';
const router = express.Router();
//for run code
router.post('/submissions' ,userValidation,codeValidation(), validate,  runCode );
//for submit 
router.post('/submit' ,  codeValidation(), validate, submitCode );
router.get('/submissions/:id' ,  getSubmissionById);
// router.post('/submission/save' ,saveSubmission );

export default router;

