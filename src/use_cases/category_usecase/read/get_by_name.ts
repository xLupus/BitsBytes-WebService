import {ICategoryRepository} from "../../../types/category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";

export class GetCategoryByNameUseCase {
    category_repository: ICategoryRepository

    constructor(category_repository: ICategoryRepository) {
        this.category_repository = category_repository;
    }

    execute = async (category_name: string) => {
        try {
            const category = await this.category_repository.getByName(category_name);

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