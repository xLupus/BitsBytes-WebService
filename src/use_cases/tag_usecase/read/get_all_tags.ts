import {TagRepository} from "../../../types/tag";

export class GetAllTagsUseCase {
    tag_repository: TagRepository;

    constructor(tag_repository: TagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async () => {
        try {
            const tags = await this.tag_repository.getAll();

            return {
                error: null, tags: tags
            };
        } catch (error) {
            return {
                error: error, tags: null
            };
        }
    };
}