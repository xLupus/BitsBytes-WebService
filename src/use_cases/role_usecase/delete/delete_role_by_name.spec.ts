/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository";
import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { CreateRoleUseCase } from "../create/create_role";
import { DeleteRoleByNameUseCase } from "./delete_role_by_name";

describe("Delete a Role by ID UseCase", () => {
    const role_repository = new RoleRepositoryPostgres();
    const delete_role_by_name = new DeleteRoleByNameUseCase(role_repository);


    it("should be able to delete a role by NAME", async () => {
        const role_name = "Delete";
        const role = { name: role_name, description: "Role to Delete" };

        const create_role_usecase = new CreateRoleUseCase(role_repository);
        await create_role_usecase.execute(role);

        const { error, isDeleted } = await delete_role_by_name.execute(role_name);

        expect(error).toBeNull();
        expect(isDeleted).toBe(true);
    });


    it("shouldn't be able to delete a role that not exist", async () => {
        const role_name = "Delete a nonexist role";

        const { error, isDeleted } = await delete_role_by_name.execute(role_name);

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(isDeleted).toBe(false);
    });
});