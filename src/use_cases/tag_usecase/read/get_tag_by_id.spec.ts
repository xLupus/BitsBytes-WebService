/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {randomUUID} from "crypto";
import {CreateTagUseCase} from "../create/create_tag";
import {ITagRepository} from "../../../types/tag";
import {GetTagByIdUseCase} from "./get_tag_by_id";
import {TagRepositoryPostgres} from "../../../repositories/postgres/tag_repository";
import {TagNotFoundError} from "../../../http/exceptions/tag_exceptions";

describe("Get Role By ID UseCase", () => {
    let tag_repository: ITagRepository;
    let get_tag_by_id: GetTagByIdUseCase;

    beforeEach(() => {
        tag_repository = new TagRepositoryPostgres();
        get_tag_by_id = new GetTagByIdUseCase(tag_repository);
    });

    it("should be able to get a Role by ID", async () => {
        const create_tag = new CreateTagUseCase(tag_repository);

        const tag_id = randomUUID().toString();
        await create_tag.execute({
            id: tag_id,
            name: "Cargo Exemplo",
            description: "Cargo criado para testar o usecase de get tag by id",
        });

        const {error, tag} = await get_tag_by_id.execute(tag_id);

        expect(error).toBeNull();
    });

    it("shouldn't be able to get a Role that not exists", async () => {
        const tag_id = randomUUID().toString();

        const {error, tag} = await get_tag_by_id.execute(tag_id);

        expect(error).toBeInstanceOf(TagNotFoundError);
        expect(tag).toBeNull();
    });

    it("shouldn't be able to get a Role by an Empty ID", async () => {
        const {error, tag} = await get_tag_by_id.execute("");

        expect(error).toBeInstanceOf(TagNotFoundError);
        expect(tag).toBeNull();
    });
});