import z from "zod";
import {active_schema, description_schema, name_schema, uuid_schema} from "./index";

export const create_category_schema = z.object({
    id: uuid_schema.optional(),
    name: name_schema,
    description: description_schema,
    active: active_schema.optional(),
})

export const update_category_schema = z.object({
    name: name_schema.optional(),
    description: description_schema.optional(),
    active: active_schema.optional(),
})
