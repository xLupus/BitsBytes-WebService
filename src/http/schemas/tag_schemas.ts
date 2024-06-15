import z from "zod";
import { active_schema, description_schema, name_schema, uuid_schema } from ".";

export const create_tag_schema = z.object({
    id: uuid_schema.optional(),
    name: name_schema,
    description: description_schema,
    active: active_schema.optional()
})

export const update_tag_schema = z.object({
    name: name_schema.optional(),
    description: description_schema.optional(),
    active: active_schema.optional()
})