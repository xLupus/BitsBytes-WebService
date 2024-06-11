import z from "zod";

const active_schema = z.boolean()
const uuid_schema = z.string().uuid()

const user_name_schema = z
    .string({
        invalid_type_error: "",
        required_error: ""
    })
    .min(1)

const user_email_schema = z
    .string()
    .min(1)
    .email()

const user_password_schema = z
    .string()
    .min(1)

const user_role_id_schema = z
    .string()
    .min(1)
    .uuid()
    .refine(role => { })


export const create_user_schema = z.object({
    id: uuid_schema.optional(),
    name: user_name_schema,
    email: user_email_schema,
    password: user_password_schema,
    role_id: user_role_id_schema,
    active: active_schema.optional(),
})

export const update_user_schema = z.object({
    id: uuid_schema.optional(),
    name: user_name_schema.optional(),
    email: user_email_schema.optional(),
    password: user_password_schema.optional(),
    role_id: user_role_id_schema.optional(),
    active: active_schema.optional(),
})