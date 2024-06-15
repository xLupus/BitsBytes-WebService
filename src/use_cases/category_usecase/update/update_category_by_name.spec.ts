/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {ICategoryRepository} from "../../../types/category";
import {UpdateCategoryByNameUseCase} from "./update_category_by_name";
import {CreateCategoryUseCase} from "../create/create_category";
import {
    CategoryNameAlreadyBeingUsedError,
    CategoryNotFoundError,
    CategoryValidationError
} from "../../../http/exceptions/category_expections";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";

describe("Update a Role by NAME UseCase", () => {
    let category_repository: ICategoryRepository;
    let update_category_by_name: UpdateCategoryByNameUseCase;

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres();
        update_category_by_name = new UpdateCategoryByNameUseCase(category_repository);
    });

    it("should be able to update a category ", async () => {
        const category = {
            name: "Update",
            description: "A category to be updated"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const {error, isUpdated} = await update_category_by_name.execute(category.name, {
            name: "Updated"
        });

        expect(error).toBeNull();
        expect(isUpdated).toBe(true);
    });

    it("shouldn't be able to update a category with a used name", async () => {
        const category = {
            name: "Should not update",
            description: "A category to be updated"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const {error, isUpdated} = await update_category_by_name.execute(category.name, category);

        expect(error).toBeInstanceOf(CategoryNameAlreadyBeingUsedError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a category that not exist", async () => {
        const {error, isUpdated} = await update_category_by_name.execute("Categoria inexistente", {
            name: "Categoria existente"
        });

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a category passing an empty field", async () => {
        const category = {
            name: "Should not update an empty field",
            description: "A category to be updated"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const {error, isUpdated} = await update_category_by_name.execute(category.name, {
            name: ""
        });

        expect(error).toBeInstanceOf(CategoryValidationError);
        expect(isUpdated).toBe(false);
    });
});
