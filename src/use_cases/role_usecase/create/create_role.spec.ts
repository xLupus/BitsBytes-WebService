/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { RoleNameAlreadyBeingUsedError, RoleValidationError } from "../../../http/esceptions/role-exceptions";
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository";
import { RoleInput } from "../../../types/role";
import { CreateRoleUseCase } from "./create_role";

describe("Create Role UseCase", () => {
    let role_repository: RoleRepositoryPostgres;
    let create_role_usecase: CreateRoleUseCase;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
        create_role_usecase = new CreateRoleUseCase(role_repository);
    });

    it("should be able to create a role", async () => {
        const role: RoleInput = {
            name: "Usuario",
            description: "Usuario"
        };

        const { error, isCreated } = await create_role_usecase.execute(role);

        expect(error).toBeNull();
        expect(isCreated).toBe(true);
    });

    it("shouldn't be able to create a role that already exist", async () => {
        const role: RoleInput = {
            name: "Usuario",
            description: "Usuario"
        };

        await create_role_usecase.execute(role);
        const { error, isCreated } = await create_role_usecase.execute(role);

        expect(error).toBeInstanceOf(RoleNameAlreadyBeingUsedError);
        expect(isCreated).toBe(false);
    });

    it("shouldn't be able to create a role without a required field", async () => {
        const role = {
            name: "Usuario"
        };

        const { error, isCreated } = await create_role_usecase.execute(role as RoleInput);

        expect(error).toBeInstanceOf(RoleValidationError);
        expect(isCreated).toBe(false);
    });

    it("shouldn't be able to create a role with empty fields", async () => {
        const role: RoleInput = {
            name: "",
            description: ""
        };

        const { error, isCreated } = await create_role_usecase.execute(role);

        expect(error).toBeInstanceOf(RoleValidationError);
        expect(isCreated).toBe(false);
    });
});