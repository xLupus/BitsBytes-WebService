/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import {ICategoryRepository} from "../../../types/category";
import {DeleteCategoryByNameUseCase} from "./delete_category_by_name";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";
import {CreateCategoryUseCase} from "../create/create_category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";

describe("Delete a Role by ID UseCase", () => {
    let category_repository: ICategoryRepository;
    let delete_category_by_name: DeleteCategoryByNameUseCase

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres();
        delete_category_by_name = new DeleteCategoryByNameUseCase(category_repository);
    })

    it("should be able to delete a category", async () => {
        const category = {
            name: "deleted",
            description: "Role to Delete"
        };

        const create_category = new CreateCategoryUseCase(category_repository);
        await create_category.execute(category);

        const { error, isDeleted } = await delete_category_by_name.execute(category.name);

        expect(error).toBeNull();
        expect(isDeleted).toBe(true);
    });

    it("shouldn't be able to delete a category that not exist", async () => {
        const { error, isDeleted } = await delete_category_by_name.execute("not exist");

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(isDeleted).toBe(false);
    });
});