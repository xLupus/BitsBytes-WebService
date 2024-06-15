/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import {ICategoryRepository} from "../../../types/category";
import {DeleteCategoryByIdUseCase} from "./delete_category_by_id";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";
import {CreateCategoryUseCase} from "../create/create_category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";

describe("Delete a Role by ID UseCase", () => {
    let category_repository: ICategoryRepository;
    let delete_category_by_id: DeleteCategoryByIdUseCase

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres();
        delete_category_by_id = new DeleteCategoryByIdUseCase(category_repository);
    })

    it("should be able to delete a category", async () => {
        const category_id = randomUUID().toString();
        const category = {
            id: category_id,
            name: "deleted",
            description: "Role to Delete"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const { error, isDeleted } = await delete_category_by_id.execute(category_id);

        expect(error).toBeNull();
        expect(isDeleted).toBe(true);
    });

    it("shouldn't be able to delete a category that not exist", async () => {
        const category_id = randomUUID().toString();

        const { error, isDeleted } = await delete_category_by_id.execute(category_id);

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(isDeleted).toBe(false);
    });
});