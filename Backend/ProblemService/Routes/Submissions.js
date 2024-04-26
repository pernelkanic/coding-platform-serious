import express from 'express';
import { getSubmissionById, runCode, } from '../Controllers/SubmissionController.js';
const router = express.Router();

router.post('/submissions' ,  runCode );
// codeValidation() ,validate ,
router.get('/submissions/:id' ,  getSubmissionById);
// router.post('/submission/save' ,saveSubmission );

export default router;

