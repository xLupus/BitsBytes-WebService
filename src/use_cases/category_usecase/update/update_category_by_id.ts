import {CategoryUpdateInput, ICategoryRepository} from "../../../types/category";
import {
    CategoryNameAlreadyBeingUsedError,
    CategoryNotFoundError,
    CategoryValidationError
} from "../../../http/exceptions/category_expections";
import {update_category_schema} from "../../../http/schemas/category_schemas";
import slugify from "slugify";

export class UpdateCategoryByIdUseCase {
    category_repository: ICategoryRepository;

    constructor(category_repository: ICategoryRepository) {
        this.category_repository = category_repository;
    }

    execute = async (category_id: string, category_data: CategoryUpdateInput) => {
        try {
            const category = await this.category_repository.getById(category_id);

            if (!category)
                return {
                    error: new CategoryNotFoundError(), isUpdated: false
                }
        } catch (error) {
            return {
                error: error, isUpdated: false
            }
        }

        const category_data_validation = await update_category_schema.safeParseAsync(category_data)

        if (!category_data_validation.success)
            return {
                error: new CategoryValidationError(category_data_validation.error.formErrors.fieldErrors),
                isUpdated: false
            }

        const {name, description, active} = category_data_validation.data;

        if (name) {
            try {
                const category = await this.category_repository.getByName(name);

                if (category)
                    return {
                        error: new CategoryNameAlreadyBeingUsedError(), isUpdated: false
                    }
            } catch (error) {
                return {
                    error: error, isUpdated: false
                }
            }
        }

        try {
            await this.category_repository.updateById(category_id, {
                name,
                description,
                active,
                slug: name ? slugify(name, {lower: true}) : undefined,
            });

            return {
                error: null, isUpdated: true
            }
        } catch (error) {
            return {
                error: error, isUpdated: false
            }
        }
    }
}
