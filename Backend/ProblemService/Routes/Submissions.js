import express from 'express';
import { getSubmissionById, runCode, } from '../Controllers/SubmissionController.js';
import { userValidation } from '../Middlewares/UserValidation.js';
import { codeValidation, validate } from '../Middlewares/Validator.js';
const router = express.Router();

router.post('/submissions' ,userValidation,codeValidation(), validate,  runCode );
//
router.get('/submissions/:id' ,  getSubmissionById);
// router.post('/submission/save' ,saveSubmission );

export default router;

