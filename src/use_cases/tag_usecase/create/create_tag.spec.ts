/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { TagNameAlreadyBeingUsedError, TagValidationError } from "../../../http/exceptions/tag_exceptions";
import { TagRepositoryPostgres } from "../../../repositories/postgres/tag_repository";
import { TagInput } from "../../../types/tag";
import {CreateTagUseCase} from "./create_tag";

describe("Create Tag UseCase", () => {
    let role_repository: TagRepositoryPostgres;
    let create_role: CreateTagUseCase;

    beforeEach(() => {
        role_repository = new TagRepositoryPostgres();
        create_role = new CreateTagUseCase(role_repository);
    });

    it("should be able to create a role", async () => {
        const role: TagInput = {
            name: "Usuario",
            description: "Usuario"
        };

        const { error, isCreated } = await create_role.execute(role);

        expect(error).toBeNull();
        expect(isCreated).toBe(true);
    });

    it("shouldn't be able to create a role that already exist", async () => {
        const role: TagInput = {
            name: "Usuario",
            description: "Usuario"
        };

        await create_role.execute(role);
        const { error, isCreated } = await create_role.execute(role);

        expect(error).toBeInstanceOf(TagNameAlreadyBeingUsedError);
        expect(isCreated).toBe(false);
    });

    it("shouldn't be able to create a role without a required field", async () => {
        const role = {
            name: "Usuario"
        };

        const { error, isCreated } = await create_role.execute(role as TagInput);

        expect(error).toBeInstanceOf(TagValidationError);
        expect(isCreated).toBe(false);
    });

    it("shouldn't be able to create a role with empty fields", async () => {
        const role: TagInput = {
            name: "",
            description: ""
        };

        const { error, isCreated } = await create_role.execute(role);

        expect(error).toBeInstanceOf(TagValidationError);
        expect(isCreated).toBe(false);
    });
});