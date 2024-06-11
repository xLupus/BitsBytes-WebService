/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { RoleRepositoryPostgres } from "../../../repositories/postgres/role_repository"
import { RoleRepository } from "../../../types/role"
import { GetAllRolesUseCase } from "./get_all_roles"

describe("Get All Roles UseCase", () => {
    let role_repository: RoleRepository
    let get_all_roles_usecase: GetAllRolesUseCase

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres()
        get_all_roles_usecase = new GetAllRolesUseCase(role_repository)
    })

    it("should get all Roles", async () => {
        const {error, roles} = await get_all_roles_usecase.execute()

        expect(error).toBeNull()
    })


    it.todo("Achar um jeito de criar testes de erro")
    it.todo("Achar um jeito de criar testes para Filtro, Ordenação, Paginação")
})