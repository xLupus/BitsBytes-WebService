import {Category, CategoryInput, CategoryUpdateInput, ICategoryRepository} from "../../../types/category";
import prisma from "../../../database/client"

export class CategoryRepositoryPostgres implements ICategoryRepository {
    getAll = async () => {
        const categories = await prisma.category.findMany()

        return categories as Category[]
    }

    getByName = async (name: string) => {
        const category = await prisma.category.findUnique({
            where: {name: name}
        })

        return category as Category
    }

    getById = async (id: string) => {
        const category = await prisma.category.findUnique({
            where: {id: id}
        })

        return category as Category
    }

    create = async (data: CategoryInput) => {
        const category = await prisma.category.create({
            data: {
                id: data.id,
                name: data.name,
                description: data.description,
                slug: data.slug,
                active: data.active,
            }
        })

        return category as Category
    }

    updateByName = async (name: string, data: CategoryUpdateInput) => {
        await prisma.category.update({
            where: {name: name},
            data: data
        })
    }

    updateById = async (id: string, data: CategoryUpdateInput) => {
        await prisma.category.update({
            where: {id: id},
            data: data
        })
    }

    deleteById = async (id: string) => {
        await prisma.category.delete({where: {id: id}})
    }

    deleteByName = async (name: string) => {
        await prisma.category.delete({where: {name: name}})
    }
}