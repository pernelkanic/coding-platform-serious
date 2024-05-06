import express from 'express';
import { getProblems } from '../Controllers/ProblemController.js';
const router = express.Router();

router.post('/' , getUserId);
// router.get('/problem/:id' , getProblemById);
router.get('/' ,getProblems );

export default router;

