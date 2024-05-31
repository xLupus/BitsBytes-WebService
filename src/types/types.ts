export type HttpResponseFormat = {
    status: number,
    message: string,
    data?: object,
    errors?: object
}

export type BaseRepository<T, C, U> = {
    getAll: (options?: any) => Promise<T[]>
    getById: (id: string) => Promise<T | null>
    create: (data: C) => Promise<T>
    updateById: (id: string, data: U) => Promise<T>
    deleteById: (id: string) => Promise<T>
}

export type FilterParamQuery<T> = {
    column: T,
    value: string
}

export type OrderByParamQuery<T> = {
    column: T,
    order_operator: "asc" | "desc"
}

export type PaginationParamQuery = {
    skip?: number,
    take?: number
}
