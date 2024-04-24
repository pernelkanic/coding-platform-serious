import express from 'express';
const router = express.Router();

router.post('/submissions' , codeValidation() ,validate , runCode );
router.get('/submissions/:id' , getSubmissionById);
router.post('/submission/save' ,saveSubmission );

export default router;

