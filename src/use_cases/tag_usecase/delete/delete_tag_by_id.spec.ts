/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { TagRepositoryPostgres } from "../../../repositories/postgres/tag_repository";
import { TagNotFoundError } from "../../../http/exceptions/tag_exceptions";
import { DeleteTagByIdUseCase } from "./delete_tag_by_id";
import { CreateTagUseCase } from "../create/create_tag";

describe("Delete a Tag by ID UseCase", () => {
    const tag_repository = new TagRepositoryPostgres();
    const delete_tag_by_id = new DeleteTagByIdUseCase(tag_repository);

    it("should be able to delete a tag", async () => {
        const tag_id = randomUUID().toString();
        const tag = {
            id: tag_id,
            name: "deleted",
            description: "Tag to Delete"
        };

        const create_tag_usecase = new CreateTagUseCase(tag_repository);
        await create_tag_usecase.execute(tag);

        const { error, isDeleted } = await delete_tag_by_id.execute(tag_id);

        expect(error).toBeNull();
        expect(isDeleted).toBe(true);
    });

    it("shouldn't be able to delete a tag that not exist", async () => {
        const tag_id = randomUUID().toString();

        const { error, isDeleted } = await delete_tag_by_id.execute(tag_id);

        expect(error).toBeInstanceOf(TagNotFoundError);
        expect(isDeleted).toBe(false);
    });
});