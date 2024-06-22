import { TagNameAlreadyBeingUsedError, TagNotFoundError, TagValidationError } from "../../../http/exceptions/tag_exceptions";
import { update_tag_schema } from "../../../http/schemas/tag_schemas";
import { ITagRepository, TagUpdateInput } from "../../../types/tag";

export class UpdateTagByIdUseCase {
    tag_repository: ITagRepository;

    constructor(tag_repository: ITagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async (tag_id: string, tag_data: TagUpdateInput) => {
        const tag_data_validation = await update_tag_schema.safeParseAsync(tag_data);

        if (!tag_data_validation.success)
            return {
                error: new TagValidationError(tag_data_validation.error.formErrors.fieldErrors),
                isUpdated: false
            };

        const tag_data_validated = tag_data_validation.data;

        try {
            const tag = await this.tag_repository.getById(tag_id);

            if (!tag)
                return {
                    error: new TagNotFoundError(),
                    isUpdated: false
                };


        } catch (error) {
            return {
                error: error, isUpdated: false
            };
        }

        if (tag_data_validated.name) {
            try {
                const tag = await this.tag_repository.getByName(tag_data_validated.name);

                if (tag)
                    return {
                        error: new TagNameAlreadyBeingUsedError(),
                        isUpdated: false
                    };
            } catch (error) {
                return {
                    error: error, isUpdated: false
                };
            }
        }

        try {
            await this.tag_repository.updateById(tag_id, tag_data_validated);

            return {
                error: null, isUpdated: true
            };
        } catch (error) {
            return {
                error: error, isUpdated: false
            };
        }
    };
}