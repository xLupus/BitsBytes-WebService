import z from "zod";
import {active_schema, email_schema, name_schema, password_schema, uuid_schema} from "./index";


export const create_user_schema = z.object({
    id: uuid_schema.optional(),
    name: name_schema,
    email: email_schema,
    password: password_schema,
    role_id: uuid_schema,
    active: active_schema.optional(),
})

export const update_user_schema = z.object({
    name: name_schema.optional(),
    email: email_schema.optional(),
    password: password_schema.optional(),
    role_id: uuid_schema.optional(),
    active: active_schema.optional(),
})