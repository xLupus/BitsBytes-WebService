import { TagNameAlreadyBeingUsedError, TagNotFoundError, TagValidationError } from "../../../http/exceptions/tag_exceptions";
import { update_tag_schema } from "../../../http/schemas/tag_schemas";
import { TagRepository, TagUpdateInput } from "../../../types/tag";

export class UpdateTagByNameUseCase {
    tag_repository: TagRepository;

    constructor(tag_repository: TagRepository) {
        this.tag_repository = tag_repository;
    }

    execute = async (tag_name: string, tag_data: TagUpdateInput) => {
        const tag_data_validation = await update_tag_schema.safeParseAsync(tag_data);

        if (!tag_data_validation.success)
            return {
                error: new TagValidationError(tag_data_validation.error.formErrors.fieldErrors),
                isUpdated: false
            };

        const tag_data_validated = tag_data_validation.data;

        try {
            const tag = await this.tag_repository.getByName(tag_name);

            if (!tag)
                return {
                    error: new TagNotFoundError(),
                    isUpdated: false
                };

        } catch (error) {
            console.log(error);

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
                console.log(error);

                return {
                    error: error, isUpdated: false
                };
            }
        }

        try {
            await this.tag_repository.updateByName(tag_name, tag_data_validated);

            return {
                error: null,
                isUpdated: true
            };
        } catch (error) {
            return {
                error: error, isUpdated: false
            };
        }
    };
}