import { Router } from "express";
import { TagController } from "../../../controllers/v1/tag_controller";

const tag_routes = Router()
const tag_controller = new TagController()

tag_routes
    .post("/tags", tag_controller.create)
    .get("/tags", tag_controller.getAll)
    .get("/tags/:tag_id", tag_controller.getById)
    .put("/tags/:tag_id", tag_controller.updateById)
    .delete("/tags/:tag_id", tag_controller.deleteById)

export default tag_routes