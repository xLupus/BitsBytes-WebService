import { Router } from "express";
import role_routes from "./role_routes";

const api_v1_routes = Router()

api_v1_routes.use(role_routes)

export default api_v1_routes