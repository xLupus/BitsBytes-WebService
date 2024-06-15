/**
 * @jest-environment ./config/jest/prisma_test_environment
 */

import {ICategoryRepository} from "../../../types/category";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";
import {GetCategoryByIdUseCase} from "./get_by_id";
import {CreateCategoryUseCase} from "../create/create_category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";
import {randomUUID} from "crypto";

describe("Get Role By ID UseCase", () => {
    let category_repository: ICategoryRepository;
    let get_category_by_id_usecase: GetCategoryByIdUseCase;

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres();
        get_category_by_id_usecase = new GetCategoryByIdUseCase(category_repository);
    });

    it("should be able to get a Role by ID", async () => {
        const create_category_usecase = new CreateCategoryUseCase(category_repository);

        const category_id = randomUUID().toString();
        await create_category_usecase.execute({
            id: category_id,
            name: "Cargo Exemplo",
            description: "Cargo criado para testar o usecase de get category by id",
        });

        const { error,  category} = await get_category_by_id_usecase.execute(category_id);

        expect(error).toBeNull();
    });

    it("shouldn't be able to get a Role that not exists", async () => {
        const category_id = randomUUID().toString();

        const { error, category } = await get_category_by_id_usecase.execute(category_id);

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(category).toBeNull();
    });

    it("shouldn't be able to get a Role by an Empty ID", async () => {
        const { error, category } = await get_category_by_id_usecase.execute("");

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(category).toBeNull();
    });
});