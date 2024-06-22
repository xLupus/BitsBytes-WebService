import {Router} from "express";
import role_routes from "./role_routes";
import category_routes from "./category_routes";
import tag_routes from "./tag_routes";
import user_routes from "./user_routes";

const api_v1_routes = Router()

api_v1_routes.use(role_routes)
api_v1_routes.use(category_routes)
api_v1_routes.use(tag_routes)
api_v1_routes.use(user_routes)

export default api_v1_routes