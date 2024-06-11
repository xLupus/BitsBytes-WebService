import { BaseRepository, FilterParamQuery, OrderByParamQuery, PaginationParamQuery } from "./types"
import { UserOutput } from "./user"

export type Role = {
    id: string
    name: string
    description: string
    active: boolean
    created_at: Date
    updated_at: Date
}

export type RoleInput = {
    id?: string
    name: string
    description: string
    active?: boolean
}

export type RoleUpdateInput = {
    name?: string
    description?: string
    active?: boolean
}

export type RoleOutput = Role & {
    _count?: { users: number },
    users?: UserOutput[]
}

export type RoleOrderColumns = 'name'
export type RoleFilterColumns = 'name'

export type RoleRepository = BaseRepository<RoleOutput, RoleInput, RoleUpdateInput> & {
    getByName: (name: string) => Promise<RoleOutput | null>
    deleteByName: (name: string) => Promise<RoleOutput>
    updateByName: (name: string, data: RoleUpdateInput) => Promise<RoleOutput>
    getUsersByRoleId: (role_id: string) => Promise<UserOutput[]>
    getUsersByRoleName: (role_name: string) => Promise<UserOutput[]>
}

export type RoleGetAllOptions = {
    filter?: FilterParamQuery<RoleFilterColumns>,
    order?: OrderByParamQuery<RoleOrderColumns>,
    paginate?: PaginationParamQuery
}
