import {CategoryInput, ICategoryRepository} from "../../../types/category";
import {create_category_schema} from "../../../http/schemas/category_schemas";
import {CategoryNameAlreadyBeingUsedError, CategoryValidationError} from "../../../http/exceptions/category_expections";
import slugify from "slugify";

export class CreateCategoryUseCase {
    category_repository: ICategoryRepository;

    constructor(category_repository: ICategoryRepository) {
        this.category_repository = category_repository;
    }

    execute = async (category: Omit<CategoryInput, "slug">) => {
        const category_data_validation = await create_category_schema.safeParseAsync(category)

        if (!category_data_validation.success)
            return {
                error: new CategoryValidationError(category_data_validation.error.formErrors.fieldErrors),
                isCreated: false
            }

        try {
            const category_exist = await this.category_repository.getByName(category.name);

            if (category_exist)
                return {
                    error: new CategoryNameAlreadyBeingUsedError(),
                    isCreated: false
                }
        } catch (error) {
            return {error: error, isCreated: false}
        }

        try {
            const {id, name, description, active} = category_data_validation.data

            await this.category_repository.create({
                id,
                name,
                active,
                description,
                slug: slugify(name, {lower: true}),
            })

            return {error: null, isCreated: true}
        } catch (error) {
            return {error: error, isCreated: false}
        }

    }
}