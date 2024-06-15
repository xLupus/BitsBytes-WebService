/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {CategoryInput, ICategoryRepository} from "../../../types/category";
import {CreateCategoryUseCase} from "./create_category";
import {CategoryRepositoryPostgres} from "../../../repositories/postgres/category_repository";
import {CategoryNameAlreadyBeingUsedError, CategoryValidationError} from "../../../http/exceptions/category_expections";

describe('Create Category UseCase', () => {
    let category_repository: ICategoryRepository;
    let create_category_usecase: CreateCategoryUseCase;

    beforeEach(() => {
        category_repository = new CategoryRepositoryPostgres()
        create_category_usecase = new CreateCategoryUseCase(category_repository);
    })

    it('Should be able to create a new category', async () => {
        const category = {
            name: "Cargo Exemplo",
            description: "Cargo criado para testar o usecase",
        }

        const {error, isCreated} = await create_category_usecase.execute(category);

        expect(error).toBeNull();
        expect(isCreated).toBe(true);
    })

    it("Shouldn't be able to create a new category that already exist", async () => {
        const category = {
            name: "Cargo Exemplo",
            description: "Cargo criado para testar o usecase",
        }

        await create_category_usecase.execute(category);
        const {error, isCreated} = await create_category_usecase.execute(category);

        expect(error).toBeInstanceOf(CategoryNameAlreadyBeingUsedError);
        expect(isCreated).toBe(false);
    })

    it("shouldn't be able to create a role without a required field", async () => {
        const category = {
            name: "Cargo Exemplo",
        }

        const { error, isCreated } = await create_category_usecase.execute(category as CategoryInput);

        expect(error).toBeInstanceOf(CategoryValidationError);
        expect(isCreated).toBe(false);
    });

    it("shouldn't be able to create a role with empty fields", async () => {
        const category = {
            name: "",
            description: ""
        };

        const { error, isCreated } = await create_category_usecase.execute(category);

        expect(error).toBeInstanceOf(CategoryValidationError);
        expect(isCreated).toBe(false);
    });
})