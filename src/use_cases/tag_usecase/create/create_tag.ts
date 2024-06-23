import {TagInput, ITagRepository} from "../../../types/tag";
import {create_tag_schema} from "../../../http/schemas/tag_schemas";
import {TagNameAlreadyBeingUsedError, TagValidationError} from "../../../http/exceptions/tag_exceptions";

export class CreateTagUseCase {
    tag_repository: ITagRepository;

    constructor(tag_repository: ITagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async (tag_data: TagInput) => {
        const tag_data_validation = await create_tag_schema.safeParseAsync(tag_data);

        if (!tag_data_validation.success) {
            return {
                error: new TagValidationError(tag_data_validation.error.formErrors.fieldErrors),
                isCreated: false
            };
        }

        const tag_data_validated = tag_data_validation.data;

        try {
            const tag = await this.tag_repository.getByName(tag_data_validated.name);

            if (tag)
                return {
                    error: new TagNameAlreadyBeingUsedError(),
                    isCreated: false
                };

        } catch (error) {
            console.log(error);

            return {
                error: error, isCreated: false
            };
        }

        try {
            await this.tag_repository.create(tag_data);

            return {
                error: null, isCreated: true
            };

        } catch (error) {
            console.log(error);

            return {
                error: error, isCreated: false
            };
        }
    };
}