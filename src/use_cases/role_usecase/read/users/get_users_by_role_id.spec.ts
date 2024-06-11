/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { RoleNotFoundError } from "../../../../http/esceptions/role-exceptions";
import { RoleRepositoryPostgres } from "../../../../repositories/postgres/role_repository";
import { RoleRepository } from "../../../../types/role";
import { CreateRoleUseCase } from "../../create/create_role";
import { getUsersByRoleIdUseCase } from "./get_users_by_role_id";

describe("Get Users by Role ID", () => {
    let role_repository: RoleRepository;
    let get_users_by_role_id_usecase: getUsersByRoleIdUseCase;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
        get_users_by_role_id_usecase = new getUsersByRoleIdUseCase(role_repository);
    });

    it("should be able to get Users", async () => {
        const role_id = randomUUID().toString();

        const role = {
            id: role_id,
            name: "Redator",
            description: "Responsavel por escrever as postagens"
        };

        const create_role_usecase = new CreateRoleUseCase(role_repository);
        await create_role_usecase.execute(role);

        const {error, users} = await get_users_by_role_id_usecase.execute(role_id);

        expect(error).toBeNull()
        expect(users).toBeTruthy()
    });

    it("shouldn't be able by passing a unexist Role", async () => {
        const {error, users} = await get_users_by_role_id_usecase.execute("Unexist Role ID");

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(users).toBeNull();
    });
});