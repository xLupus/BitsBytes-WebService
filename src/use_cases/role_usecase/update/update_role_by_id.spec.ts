/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository";
import { RoleNameAlreadyBeingUsedError, RoleNotFoundError, RoleValidationError } from "../../../http/esceptions/role-exceptions";
import { UpdateRoleByIdUseCase } from "./update_role_by_id";
import { RoleInput, RoleRepository } from "../../../types/role";
import { CreateRoleUseCase } from "../create/create_role";

describe("Update a Role by ID UseCase", () => {
    let role_repository: RoleRepository;
    let update_role_by_id_usecase: UpdateRoleByIdUseCase;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
        update_role_by_id_usecase = new UpdateRoleByIdUseCase(role_repository);
    });

    it("should be able to update a role ", async () => {
        const role_id = randomUUID().toString();

        const role: RoleInput = {
            id: role_id,
            name: "Update",
            description: "A role to be updated"
        };

        const create_role_usecase = new CreateRoleUseCase(role_repository);
        await create_role_usecase.execute(role);

        const { error, isUpdated } = await update_role_by_id_usecase.execute(role_id, {
            ...role,
            name: "Updated"
        });

        expect(error).toBeNull();
        expect(isUpdated).toBe(true);
    });

    it("shouldn't be able to update a role with a used name", async () => {
        const role_id = randomUUID().toString();

        const role: RoleInput = {
            id: role_id,
            name: "Update",
            description: "A role to be updated"
        };

        const create_role_usecase = new CreateRoleUseCase(role_repository);
        await create_role_usecase.execute(role);

        const { error, isUpdated } = await update_role_by_id_usecase.execute(role_id, role);

        expect(error).toBeInstanceOf(RoleNameAlreadyBeingUsedError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a role that not exist", async () => {
        const role_id = randomUUID().toString();

        const { error, isUpdated } = await update_role_by_id_usecase.execute(role_id, {
            name: "Gerente"
        });

        expect(error).toBeInstanceOf(RoleNotFoundError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a role passing an empty field", async () => {
        const role_id = randomUUID().toString();

        const { error, isUpdated } = await update_role_by_id_usecase.execute(role_id, {
            name: ""
        });

        expect(error).toBeInstanceOf(RoleValidationError);
        expect(isUpdated).toBe(false);
    });
});
