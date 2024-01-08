import express from "express"
import { addTask, getTask, removeTask,updateTask , markDone} from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask",requireAuth, getTask)
router.delete('/removeTask/:id',requireAuth, removeTask)
router.put('/updateTask/:id',requireAuth, updateTask);
router.put('/markDone/:id', requireAuth , markDone);

export default router;