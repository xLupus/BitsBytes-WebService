import {BaseRepository} from "./types";

export type Category = {
    id: string
    name: string
    description: string
    active: boolean
    slug: string
    created_at: Date
    updated_at: Date
}

export type CategoryInput = {
    id?: string
    name: string
    description: string
    slug: string
    active?: boolean
}

export type CategoryUpdateInput = {
    id?: string
    name?: string
    description?: string
    active?: boolean
    slug?: string
}

export interface ICategoryRepository extends BaseRepository<Category, CategoryInput, CategoryUpdateInput> {
    getByName: (name: string) => Promise<Category>
    updateByName: (name: string, data: CategoryUpdateInput) => Promise<void>
    deleteByName: (name: string) => Promise<void>
    /*
    getPostsByCategoryName: (name: string) => Promise<Category[]>
    getPostsByCategoryId: (id: string) => Promise<Category[]>
    */
}
