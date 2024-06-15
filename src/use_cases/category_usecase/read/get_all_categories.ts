import {ICategoryRepository} from "../../../types/category";

export class GetAllCategoriesUseCase {
    category_repository: ICategoryRepository

    constructor(categoryRepository: ICategoryRepository) {
        this.category_repository = categoryRepository
    }

    execute = async () => {
        try {
            const categories = await this.category_repository.getAll()

            return {
                error: null, categories: categories
            }
        } catch (error) {
            return {
                error: error, categories: null
            }
        }
    }
}