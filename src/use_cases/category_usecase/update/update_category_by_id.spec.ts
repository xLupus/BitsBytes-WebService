/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {randomUUID} from "crypto";
import {ICategoryRepository} from "../../../types/category";
import {UpdateCategoryByIdUseCase} from "./update_category_by_id";
import {CreateCategoryUseCase} from "../create/create_category";
import {
    CategoryNameAlreadyBeingUsedError,
    CategoryNotFoundError,
    CategoryValidationError
} from "../../../http/exceptions/category_expections";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";

describe("Update a Role by ID UseCase", () => {
    let category_repository: ICategoryRepository;
    let update_category_by_id: UpdateCategoryByIdUseCase;

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres();
        update_category_by_id = new UpdateCategoryByIdUseCase(category_repository);
    });

    it("should be able to update a category ", async () => {
        const category_id = randomUUID().toString();

        const category = {
            id: category_id,
            name: "Update",
            description: "A category to be updated"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const {error, isUpdated} = await update_category_by_id.execute(category_id, {
            ...category,
            name: "Updated"
        });

        expect(error).toBeNull();
        expect(isUpdated).toBe(true);
    });

    it("shouldn't be able to update a category with a used name", async () => {
        const category_id = randomUUID().toString();

        const category = {
            id: category_id,
            name: "Update",
            description: "A category to be updated"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        const create_category_response = await create_category.execute(category);

        const {error, isUpdated} = await update_category_by_id.execute(category_id, {
            name: category.name
        });

        expect(error).toBeInstanceOf(CategoryNameAlreadyBeingUsedError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a category that not exist", async () => {
        const category_id = randomUUID().toString();

        const {error, isUpdated} = await update_category_by_id.execute(category_id, {
            name: "Gerente"
        });

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a category passing an empty field", async () => {
        const category_id = randomUUID().toString();

        const category = {
            id: category_id,
            name: "Update category",
            description: "A category to be updated"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const {error, isUpdated} = await update_category_by_id.execute(category_id, {
            name: ""
        });

        expect(error).toBeInstanceOf(CategoryValidationError);
        expect(isUpdated).toBe(false);
    });
});
