/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { RoleNotFoundError } from "../../../../http/exceptions/role-exceptions";
import { RoleRepositoryPostgres } from "../../../../repositories/postgres/role_repository";
import { IRoleRepository } from "../../../../types/role";
import { CreateRoleUseCase } from "../../create/create_role";
import { getUsersByRoleNameUseCase } from "./get_users_by_role_name";

describe("Get Users by Role NAME", () => {
    let role_repository: IRoleRepository;
    let get_users_by_role_name_usecase: getUsersByRoleNameUseCase;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
        get_users_by_role_name_usecase = new getUsersByRoleNameUseCase(role_repository);
    });

    it("should be able to get Users", async () => {
        const role = {
            name: "Redator",
            description: "Responsavel por escrever as postagens"
        };

        const create_role_usecase = new CreateRoleUseCase(role_repository);
        await create_role_usecase.execute(role);

        const { error, users } = await get_users_by_role_name_usecase.execute(role.name);

        expect(error).toBeNull();
        expect(users).toBeTruthy();
    });

    it("shouldn't be able by passing a unexist Role", async () => {
        const { error, users } = await get_users_by_role_name_usecase.execute("Unexist Role ID");

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(users).toBeNull();
    });
});