import {ICategoryRepository} from "../../../types/category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";

export class DeleteCategoryByNameUseCase {
    category_repository: ICategoryRepository;

    constructor(category_repository: ICategoryRepository) {
        this.category_repository = category_repository;
    }

    execute = async (category_name: string) => {
        try {
            const category = await this.category_repository.getByName(category_name);

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
            await this.category_repository.deleteByName(category_name);

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