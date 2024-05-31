import { Router } from "express";
import { UserController } from "../../../controllers/v1/user-controller";

const user_routes = Router()
const userController = new UserController()

user_routes
    .post("/users", userController.create)
    
export default user_routes