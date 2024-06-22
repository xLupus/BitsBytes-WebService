import {BaseRepository} from "./types"

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

export type IUserRepository = BaseRepository<UserOutput, UserInput, UserUpdateInput> & {
    getByEmail: (name: string) => Promise<UserOutput | null>
    updateByEmail: (email: string, data: UserUpdateInput) => Promise<void>
    deleteByEmail: (email: string) => Promise<void>
}
