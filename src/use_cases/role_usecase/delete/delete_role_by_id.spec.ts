/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository";
import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { DeleteRoleByIdUseCase } from "./delete_role_by_id";
import { CreateRoleUseCase } from "../create/create_role";

describe("Delete a Role by ID UseCase", () => {
    const role_repository = new RoleRepositoryPostgres();
    const delete_role_by_id = new DeleteRoleByIdUseCase(role_repository);

    it("should be able to delete a role", async () => {
        const role_id = randomUUID().toString();
        const role = {
            id: role_id,
            name: "deleted",
            description: "Role to Delete"
        };

        const create_role_usecase = new CreateRoleUseCase(role_repository);
        await create_role_usecase.execute(role);

        const { error, isDeleted } = await delete_role_by_id.execute(role_id);

        expect(error).toBeNull();
        expect(isDeleted).toBe(true);
    });

    it("shouldn't be able to delete a role that not exist", async () => {
        const role_id = randomUUID().toString();

        const { error, isDeleted } = await delete_role_by_id.execute(role_id);

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(isDeleted).toBe(false);
    });
});