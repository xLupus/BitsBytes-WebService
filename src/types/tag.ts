import { BaseRepository } from "./types"

export type Tag = {
    id: string
    name: string
    description: string
    active: boolean
    created_at: Date
    updated_at: Date
}

export type TagInput = {
    id?: string
    name: string
    description: string
    active?: boolean
}

export type TagUpdateInput = {
    name?: string
    description?: string
    active?: boolean
}

export type ITagRepository = BaseRepository<Tag, TagInput, TagUpdateInput> & {
    getByName: (name: string) => Promise<Tag | null>
    deleteByName: (name: string) => Promise<void>
    updateByName: (name: string, data: TagUpdateInput) => Promise<void>
}
