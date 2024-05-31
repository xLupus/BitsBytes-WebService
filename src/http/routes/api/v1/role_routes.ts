import { Router } from "express";
import { RoleController } from "../../../controllers/v1/role-controller";

const role_routes = Router()
const role_controller = new RoleController()

role_routes
    .post("/roles", role_controller.create)
    .get("/roles", role_controller.getAll)
    .get("/roles/:role_id", role_controller.getById)
    .put("/roles/:role_id", role_controller.updateById)
    .delete("/roles/:role_id", role_controller.deleteById)

export default role_routes 