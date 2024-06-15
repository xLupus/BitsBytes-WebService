import { TagNotFoundError } from "../../../http/exceptions/tag_exceptions";
import { TagRepository } from "../../../types/tag";

export class DeleteTagByIdUseCase {
    tag_repository: TagRepository;

    constructor(tag_repository: TagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async (tag_id: string) => {
        try {
            const tag = await this.tag_repository.getById(tag_id);

            if (!tag)
                return {
                    error: new TagNotFoundError(),
                    isDeleted: false
                };

        } catch (error) {
            console.log(error);

            return {
                error: error, isDeleted: false
            };
        }

        try {
            await this.tag_repository.deleteById(tag_id);

            return {
                error: null, isDeleted: true
            };
        } catch (error) {
            return {
                error: error, isDeleted: false
            };
        }
    };
}