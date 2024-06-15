/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { TagRepositoryPostgres } from "../../../repositories/postgres/tag_repository";
import { TagNotFoundError } from "../../../http/exceptions/tag_exceptions";
import { CreateTagUseCase } from "../create/create_tag";
import { DeleteTagByNameUseCase } from "./delete_tag_by_name";

describe("Delete a Tag by ID UseCase", () => {
    const tag_repository = new TagRepositoryPostgres();
    const delete_tag_by_name = new DeleteTagByNameUseCase(tag_repository);


    it("should be able to delete a tag by NAME", async () => {
        const tag_name = "Delete";
        const tag = { name: tag_name, description: "Tag to Delete" };

        const create_tag_usecase = new CreateTagUseCase(tag_repository);
        await create_tag_usecase.execute(tag);

        const { error, isDeleted } = await delete_tag_by_name.execute(tag_name);

        expect(error).toBeNull();
        expect(isDeleted).toBe(true);
    });


    it("shouldn't be able to delete a tag that not exist", async () => {
        const tag_name = "Delete a nonexist tag";

        const { error, isDeleted } = await delete_tag_by_name.execute(tag_name);

        expect(error).toBeInstanceOf(TagNotFoundError);
        expect(isDeleted).toBe(false);
    });
});