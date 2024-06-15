import {Router} from "express";
import {CategoryController} from "../../../controllers/v1/category_controller";

const category_router = Router()
const category_controller = new CategoryController()

category_router
    .post("/categories", category_controller.create)
    .get("/categories", category_controller.getAll)
    .get("/categories/:category_id", category_controller.getById)
    .put("/categories/:category_id", category_controller.updateById)
    .delete("/categories/:category_id", category_controller.deleteById)

export default category_router

