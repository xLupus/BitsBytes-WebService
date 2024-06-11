import { Role } from "./role"
import { BaseRepository } from "./types"

export type User = {
    id: string
    name: string
    email: string
    password: string
    active: boolean
    created_at: Date
    updated_at: Date
    role_id: string
}

export type UserInput = {
    id?: string
    name: string
    email: string
    password: string
    role_id: string
    active?: boolean
}

export type UserUpdateInput = {
    name?: string
    email?: string
    password?: string
    role_id?: string
    active?: boolean
}

export type UserOutput = Omit<User, "password">

export type UserRepository = BaseRepository<UserOutput, UserInput, UserUpdateInput> & {
    getByName: (name: string) => Promise<UserOutput | null>
}
