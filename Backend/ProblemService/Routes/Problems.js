import express from 'express';
import { getProblems, setProblems } from '../Controllers/ProblemController.js';
const router = express.Router();

router.post('/' , setProblems);
// router.get('/problem/:id' , getProblemById);
router.get('/' ,getProblems );

export default router;

