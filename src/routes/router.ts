import employeController from "../controllers/employeController";
import express from "express";
const router = express.Router();

router.post("/add", employeController.addEmploye);

export default router;
