/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { TagRepositoryPostgres } from "../../../repositories/postgres/tag_repository";
import { TagNameAlreadyBeingUsedError, TagNotFoundError, TagValidationError } from "../../../http/exceptions/tag_exceptions";
import { TagInput, TagRepository } from "../../../types/tag";
import { CreateTagUseCase } from "../create/create_tag";
import { UpdateTagByNameUseCase } from "./update_tag_by_name";

describe("Update a Tag by ID UseCase", () => {
    let tag_repository: TagRepository;
    let update_tag_by_name: UpdateTagByNameUseCase;

    beforeEach(() => {
        tag_repository = new TagRepositoryPostgres();
        update_tag_by_name = new UpdateTagByNameUseCase(tag_repository);
    });

    it("should be able to update a tag ", async () => {
        const tag: TagInput = {
            name: "Update",
            description: "A tag to be updated"
        };

        const create_tag_usecase = new CreateTagUseCase(tag_repository);
        await create_tag_usecase.execute(tag);

        const { error, isUpdated } = await update_tag_by_name.execute(tag.name, {
            ...tag,
            name: "Updated"
        });

        expect(error).toBeNull();
        expect(isUpdated).toBe(true);
    });

    it("shouldn't be able to update a tag with a used name", async () => {
        const tag: TagInput = {
            name: "Update",
            description: "A tag to be updated"
        };

        const create_tag_usecase = new CreateTagUseCase(tag_repository);
        await create_tag_usecase.execute(tag);

        const { error, isUpdated } = await update_tag_by_name.execute(tag.name, tag);

        expect(error).toBeInstanceOf(TagNameAlreadyBeingUsedError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a tag that not exist", async () => {
        const { error, isUpdated } = await update_tag_by_name.execute("Gestor", {
            name: "Gerente"
        });

        expect(error).toBeInstanceOf(TagNotFoundError);
        expect(isUpdated).toBe(false);
    });

    it("shouldn't be able to update a tag passing an empty field", async () => {

        const { error, isUpdated } = await update_tag_by_name.execute("Gestor", {
            name: ""
        });

        expect(error).toBeInstanceOf(TagValidationError);
        expect(isUpdated).toBe(false);
    });
});
