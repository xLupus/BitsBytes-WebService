import {ICategoryRepository} from "../../../types/category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";

export class DeleteCategoryByIdUseCase {
    category_repository: ICategoryRepository;

    constructor(category_repository: ICategoryRepository) {
        this.category_repository = category_repository;
    }

    execute = async (category_id: string) => {
        try {
            const category = await this.category_repository.getById(category_id);

            if (!category)
                return {
                    error: new CategoryNotFoundError(), isDeleted: false
                }
        } catch (error) {
            return {
                error: error, isDeleted: false
            }
        }

        try {
            await this.category_repository.deleteById(category_id);

            return {
                error: null, isDeleted: true
            }
        } catch (error) {
            return {
                error: error, isDeleted: false
            }
        }
    }
}