import { Prisma } from "@prisma/client";
import { RoleGetAllOptions, RoleOutput, RoleRepository } from "../../../types/role";
import { RoleInput, RoleUpdateInput } from "../../../types/role";
import prisma from "../../../database/client";
import { UserOutput } from "../../../types/user";

export class RoleRepositoryPostgres implements RoleRepository {
    getAll = async (options?: RoleGetAllOptions) => {
        const prismaOptions: Prisma.RoleFindManyArgs = {};

        if (options?.filter) {
            if (options.filter.column == "name")
                prismaOptions.where = { name: { contains: options.filter.value } };
        }

        if (options?.order) {
            if (options.order.column == "name")
                prismaOptions.orderBy = { name: options.order.order_operator };
        }

        if (options?.paginate) {
            if (options.paginate.skip)
                prismaOptions.skip = options.paginate.skip;

            if (options.paginate.take)
                prismaOptions.take = options.paginate.take;
        }

        const roles = await prisma.role.findMany(prismaOptions);

        // const roles_output = roles.map(role => {})

        return roles as RoleOutput[];
    };

    getById = async (role_id: string) => {
        const role = await prisma.role.findUnique({
            where: { id: role_id },
            include: { _count: true }
        });

        if (!role)
            return null;

        const role_output: RoleOutput = {
            active: role.active,
            created_at: role.created_at,
            description: role.description,
            name: role.name,
            id: role.id,
            updated_at: role.updated_at,

        };

        return role_output;
    };

    getByName = async (role_name: string) => {
        const role = await prisma.role.findUnique({
            where: { name: role_name }
        });

        if (!role)
            return null;

        const role_output: RoleOutput = {
            active: role.active,
            created_at: role.created_at,
            description: role.description,
            name: role.name,
            id: role.id,
            updated_at: role.updated_at
        };

        return role_output;
    };

    create = async ({ name, description, active, id }: RoleInput) => {
        const role = await prisma.role.create({
            data: {
                id, name, description, active,
            }
        });

        return role;
    };

    updateById = async (role_id: string, role_data: RoleUpdateInput) => {
        await prisma.role.update({
            where: { id: role_id },
            data: role_data
        });
    };

    updateByName = async (role_name: string, role_data: RoleUpdateInput) => {
        await prisma.role.update({
            where: { name: role_name },
            data: role_data
        });
    };

    deleteById = async (role_id: string) => {
        await prisma.role.delete({
            where: { id: role_id }
        });
    };

    deleteByName = async (role_name: string) => {
        await prisma.role.delete({
            where: { name: role_name }
        });
    };

    getUsersByRoleId = async (role_id: string) => {
        const users = await prisma.user.findMany({
            where: { role_id }
        });

        return users as UserOutput[];
    };

    getUsersByRoleName = async (role_name: string) => {
        const users = await prisma.user.findMany({
            where: {
                role: { name: role_name }
            }
        });

        return users as UserOutput[];
    };
}