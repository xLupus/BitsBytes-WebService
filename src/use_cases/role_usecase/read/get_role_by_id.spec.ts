/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository";
import { GetRoleByIdUseCase } from "./get_role_by_id";
import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { IRoleRepository } from "../../../types/role";
import { CreateRoleUseCase } from "../create/create_role";

describe("Get Role By ID UseCase", () => {
    let role_repository: IRoleRepository;
    let get_role_by_id_usecase: GetRoleByIdUseCase;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
        get_role_by_id_usecase = new GetRoleByIdUseCase(role_repository);
    });

    it("should be able to get a Role by ID", async () => {
        const create_role_usecase = new CreateRoleUseCase(role_repository);

        const role_id = randomUUID().toString();
        await create_role_usecase.execute({
            id: role_id,
            name: "Cargo Exemplo",
            description: "Cargo criado para testar o usecase de get role by id",
        });

        const { error, role } = await get_role_by_id_usecase.execute(role_id);

        expect(error).toBeNull();
    });

    it("shouldn't be able to get a Role that not exists", async () => {
        const role_id = randomUUID().toString();

        const { error, role } = await get_role_by_id_usecase.execute(role_id);

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(role).toBeNull();
    });

    it("shouldn't be able to get a Role by an Empty ID", async () => {
        const { error, role } = await get_role_by_id_usecase.execute("");

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(role).toBeNull();
    });
});