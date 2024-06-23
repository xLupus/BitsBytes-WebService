import {ITagRepository} from "../../../types/tag";
import {TagNotFoundError} from "../../../http/exceptions/tag_exceptions";

export class GetTagByIdUseCase {
    tag_repository: ITagRepository;

    constructor(tag_repository: ITagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async (tag_id: string) => {
        try {
            const tag = await this.tag_repository.getById(tag_id);

            if (!tag)
                return {
                    error: new TagNotFoundError(), tag: null
                };

            return {
                error: null, tag: tag
            };
        } catch (error) {
            return {
                error: error, tag: null
            };
        }
    };
}