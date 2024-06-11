/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository";
import { RoleNotFoundError } from "../../../http/esceptions/role-exceptions";
import { RoleRepository } from "../../../types/role";
import { CreateRoleUseCase } from "../create/create_role";
import { GetRoleByNameUseCase } from "./get_role_by_name";

describe("Get Role By NAME UseCase", () => {
    let role_repository: RoleRepository;
    let get_role_by_name_usecase: GetRoleByNameUseCase;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
        get_role_by_name_usecase = new GetRoleByNameUseCase(role_repository);
    });

    it("should be able to get a Role by Name", async () => {
        const role_name = "Gerente";

        const create_role_usecase = new CreateRoleUseCase(role_repository);

        await create_role_usecase.execute({
            name: role_name,
            description: "Test UseCase"
        });

        const { error, role } = await get_role_by_name_usecase.execute(role_name);

        expect(error).toBeNull();
        expect(role).toHaveProperty("name", role_name);
    });

    it("shouldn't be able to get a Role that not exists", async () => {
        const role_name = "Coordenador";

        const { error, role } = await get_role_by_name_usecase.execute(role_name);

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(role).toBeNull();
    });

    it("shouldn't be able to get a Role by an Empty Name", async () => {
        const { error, role } = await get_role_by_name_usecase.execute("");

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(role).toBeNull();
    });
});