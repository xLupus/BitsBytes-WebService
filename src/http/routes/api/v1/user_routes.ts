import {Router} from "express";
import {UserController} from "../../../controllers/v1/user_controller";

const user_routes = Router()
const user_controller = new UserController();

user_routes
    .get("/users", user_controller.getAll)
    .post("/users", user_controller.create)
    .get("/users/:user_id", user_controller.getById)
    .put("/users/:user_id", user_controller.updateById)
    .delete("/users/:user_id", user_controller.deleteById)

export default user_routes;
