import {ICategoryRepository} from "../../../types/category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";

export class GetCategoryByIdUseCase {
    category_repository: ICategoryRepository

    constructor(category_repository: ICategoryRepository) {
        this.category_repository = category_repository;
    }

    execute = async (category_id: string) => {
        try {
            const category = await this.category_repository.getById(category_id);

            if (!category)
                return {
                    error: new CategoryNotFoundError(), category: null
                }

            return {
                error: null, category: category
            }
        } catch (error) {
            return {
                error: error, category: null
            }
        }
    }
}