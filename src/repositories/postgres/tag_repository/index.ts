import {Prisma} from "@prisma/client";
import prisma from "../../../database/client";
import {TagInput, Tag, ITagRepository, TagUpdateInput} from "../../../types/tag";

export class TagRepositoryPostgres implements ITagRepository {
    getAll = async () => {
        const tags = await prisma.tag.findMany();

        return tags as Tag[];
    };

    getById = async (tag_id: string) => {
        const tag = await prisma.tag.findUnique({
            where: {id: tag_id}
        });

        if (!tag)
            return null;

        return {
            active: tag.active,
            created_at: tag.created_at,
            description: tag.description,
            name: tag.name,
            id: tag.id,
            updated_at: tag.updated_at,
        };
    };

    getByName = async (tag_name: string) => {
        const tag = await prisma.tag.findUnique({
            where: {name: tag_name}
        });

        if (!tag)
            return null;

        const tag_output: Tag = {
            active: tag.active,
            created_at: tag.created_at,
            description: tag.description,
            name: tag.name,
            id: tag.id,
            updated_at: tag.updated_at
        };

        return tag_output;
    };

    create = async ({name, description, active, id}: TagInput) => {
        const tag = await prisma.tag.create({
            data: {
                id, name, description, active,
            }
        });

        return tag as Tag;
    };

    updateById = async (tag_id: string, tag_data: TagUpdateInput) => {
        await prisma.tag.update({
            where: {id: tag_id},
            data: tag_data
        });
    };

    updateByName = async (tag_name: string, tag_data: TagUpdateInput) => {
        await prisma.tag.update({
            where: {name: tag_name},
            data: tag_data
        });
    };

    deleteById = async (tag_id: string) => {
        await prisma.tag.delete({
            where: {id: tag_id}
        });
    };

    deleteByName = async (tag_name: string) => {
        await prisma.tag.delete({
            where: {name: tag_name}
        });
    };
}