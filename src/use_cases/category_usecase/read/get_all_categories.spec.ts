/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {GetAllCategoriesUseCase} from "./get_all_categories";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";

describe("Get All Categories UseCase", () => {
    let get_all_categories_usecase: GetAllCategoriesUseCase;

    beforeEach(() => {
        get_all_categories_usecase = new GetAllCategoriesUseCase(new CategoryRepositoryPostgres())
    })

    it("should get all Categories UseCase", async () => {
        const {error, categories} = await get_all_categories_usecase.execute()

        expect(error).toBeNull()
        expect(categories).toBeDefined()
    })
})