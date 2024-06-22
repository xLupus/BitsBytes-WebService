import { TagNotFoundError } from "../../../http/exceptions/tag_exceptions";
import { ITagRepository } from "../../../types/tag";

export class DeleteTagByNameUseCase {
    tag_repository: ITagRepository;

    constructor(tag_repository: ITagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async (tag_name: string) => {
        try {
            const tag = await this.tag_repository.getByName(tag_name);

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
            await this.tag_repository.deleteByName(tag_name);

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