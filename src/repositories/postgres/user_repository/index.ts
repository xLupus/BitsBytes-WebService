import { PrismaClient } from "@prisma/client";
import { UserInput, UserUpdateInput, User, UserRepository } from "../../../types/user";

export class UserRepositoryPostgres {
    db = new PrismaClient()

    getAll = async () => {
        const users = await this.db.user.findMany()

        const usersDTO: User[] = users.map(user => {
            return {
                id: user.id,
                active: user.active,
                name: user.name,
                email: user.email,
                password: user.password,
                role_id: user.role_id,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }
        })

        return usersDTO
    }

    getById = async (user_id: string) => {
        const user = await this.db.user.findUnique({
            where: { id: user_id }
        })

        if (!user)
            return null

        const userDTO: User = {
            id: user.id,
            active: user.active,
            created_at: user.created_at,
            updated_at: user.updated_at,
            name: user.name,
            email: user.email,
            password: user.password,
            role_id: user.role_id
        }

        return userDTO
    }

    getByEmail = async (user_email: string) => {
        const user = await this.db.user.findUnique({
            where: { email: user_email }
        })

        if (!user)
            return null

        const userDTO: User = {
            id: user.id,
            active: user.active,
            created_at: user.created_at,
            updated_at: user.updated_at,
            name: user.name,
            email: user.email,
            password: user.password,
            role_id: user.role_id
        }

        return userDTO
    }

    create = async (user_data: UserInput) => {
        const user = await this.db.user.create({
            data: {
                id: user_data.id,
                name: user_data.name,
                email: user_data.email,
                password: user_data.password,
                active: user_data.active,
                role: {
                    connect: {
                        id: user_data.role_id
                    }
                }
            }
        })

        return user
    }

    updateById = async (user_id: string, user_data: UserUpdateInput) => {
        const user = await this.db.user.update({
            where: { id: user_id },
            data: {
                name: user_data.name,
                email: user_data.email,
                active: user_data.active,
                role_id: user_data.role_id,
                password: user_data.password,
            }
        })

        return user
    }

    deleteById = async (user_id: string) => {
        const user = await this.db.user.delete({
            where: { id: user_id }
        })

        return user
    }
}