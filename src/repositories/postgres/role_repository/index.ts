import { Prisma, PrismaClient } from "@prisma/client"
import { RoleGetAllOptions, RoleOutput, RoleRepository } from "../../../types/role"
import { RoleInput, RoleUpdateInput } from "../../../types/role"

export class RoleRepositoryPostgres implements RoleRepository {
    prisma = new PrismaClient()

    getAll = async (options?: RoleGetAllOptions) => {
        const prismaOptions: Prisma.RoleFindManyArgs = {}

        if (options?.filter) {
            if (options.filter.column == "name")
                prismaOptions.where = { name: { contains: options.filter.value } }
        }

        if (options?.order) {
            if (options.order.column == "name")
                prismaOptions.orderBy = { name: options.order.order_operator }
        }

        if (options?.paginate) {
            if (options.paginate.skip)
                prismaOptions.skip = options.paginate.skip

            if (options.paginate.take)
                prismaOptions.take = options.paginate.take
        }

        const roles = await this.prisma.role.findMany(prismaOptions)

        // const roles_output = roles.map(role => {})

        return roles
    }

    getById = async (role_id: string) => {
        const role = await this.prisma.role.findUnique({
            where: { id: role_id },
            include: { _count: true }
        })

        if (!role)
            return null

        const role_output: RoleOutput = {
            active: role.active,
            created_at: role.created_at,
            description: role.description,
            name: role.name,
            id: role.id,
            updated_at: role.updated_at,
            _count: {
                users: role._count.users
            }
        }

        return role_output
    }

    getByName = async (role_name: string) => {
        const role = await this.prisma.role.findUnique({
            where: { name: role_name },
            include: { _count: true }
        })

        if (!role)
            return null

        const role_output: RoleOutput = {
            active: role.active,
            created_at: role.created_at,
            description: role.description,
            name: role.name,
            id: role.id,
            updated_at: role.updated_at,
            _count: {
                users: role._count.users
            }
        }

        return role_output
    }

    create = async (role_data: RoleInput) => {
        const role = await this.prisma.role.create({
            data: role_data
        })

        return role
    }

    updateById = async (role_id: string, role_data: RoleUpdateInput) => {
        const role = await this.prisma.role.update({
            where: { id: role_id },
            data: role_data
        })

        return role
    }

    deleteById = async (role_id: string) => {
        const role = await this.prisma.role.delete({
            where: { id: role_id }
        })

        return role
    }
}