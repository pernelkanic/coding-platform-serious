import express from 'express';
const router = express.Router();

router.post('/problem' , getAllProblems);
router.get('/problem/:id' , getProblemById);
router.get('/problem' ,getProblem );

export default router;

