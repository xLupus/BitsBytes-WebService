/**
 * @jest-environment ./config/jest/prisma_test_environment
 */

import {TagRepository} from "../../../types/tag";
import {GetAllTagsUseCase} from "./get_all_tags";
import {TagRepositoryPostgres} from "../../../repositories/postgres/tag_repository";

describe("Get All Roles UseCase", () => {
    let tag_repository: TagRepository
    let get_all_tags: GetAllTagsUseCase

    beforeEach(() => {
        tag_repository = new TagRepositoryPostgres()
        get_all_tags = new GetAllTagsUseCase(tag_repository)
    })

    it("should get all Roles", async () => {
        const {error, tags} = await get_all_tags.execute()

        expect(error).toBeNull()
    })

    it.todo("Achar um jeito de criar testes de erro")
    it.todo("Achar um jeito de criar testes para Filtro, Ordenação, Paginação")
})