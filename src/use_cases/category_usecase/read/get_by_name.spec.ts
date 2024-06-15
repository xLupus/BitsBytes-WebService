/**
 * @jest-environment ./config/jest/prisma_test_environment
 */

import {ICategoryRepository} from "../../../types/category";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";
import {CreateCategoryUseCase} from "../create/create_category";
import {CategoryNotFoundError} from "../../../http/exceptions/category_expections";
import {GetCategoryByNameUseCase} from "./get_by_name";

describe("Get Role By ID UseCase", () => {
    let category_repository: ICategoryRepository;
    let get_category_by_name_usecase: GetCategoryByNameUseCase;

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres();
        get_category_by_name_usecase = new GetCategoryByNameUseCase(category_repository);
    });

    it("should be able to get a Role by Name", async () => {
        const create_category_usecase = new CreateCategoryUseCase(category_repository);

        const category_info = {
            name: "Cargo Exemplo",
            description: "Cargo criado para testar o usecase de get category by id",
        }

        await create_category_usecase.execute(category_info);

        const {error, category} = await get_category_by_name_usecase.execute(category_info.name);

        expect(error).toBeNull();
    });

    it("shouldn't be able to get a Role that not exists", async () => {
        const {error, category} = await get_category_by_name_usecase.execute("Não existe");

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(category).toBeNull();
    });

    it("shouldn't be able to get a Role by an Empty ID", async () => {
        const {error, category} = await get_category_by_name_usecase.execute("");

        expect(error).toBeInstanceOf(CategoryNotFoundError);
        expect(category).toBeNull();
    });
});