import z from "zod";
import { RoleRepositoryPostgres } from "../../repositories/postgres/role_repository";

const role_name_schema = z
    .string()
    .min(1)
    .refine(async name => {
        const role_repository = new RoleRepositoryPostgres()
        const role = await role_repository.getByName(name)

        return role ? false : true
    })

const role_description_schema = z
    .string()
    .min(1)

const role_active_schema = z
    .boolean()

export const create_role_schema = z.object({
    id: z.string().uuid().optional(),
    name: role_name_schema,
    description: role_description_schema,
    active: role_active_schema.optional()
})

export const update_role_schema = z.object({
    name: role_name_schema.optional(),
    description: role_description_schema.optional(),
    active: role_active_schema.optional()
})