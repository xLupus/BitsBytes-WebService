import {randomUUID} from "crypto";
import {RoleRepositoryPostgres} from ".";
import {Role} from "@prisma/client";
import {IRoleRepository} from "../../../types/role";
import {prismaMock} from "../../../config/jest/prisma_mock";

describe("Role Repository", () => {
    let role_repository: IRoleRepository;

    beforeEach(() => {
        role_repository = new RoleRepositoryPostgres();
    });

    describe("Create a Role", () => {
        it("should create a Role", async () => {
            const role: Role = {
                id: randomUUID().toString(),
                name: "Teste",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            // *  Define o valor de retorno para role.create
            prismaMock.role.create.mockResolvedValue(role);

            await expect(role_repository.create(role))
                .resolves
                .toEqual(role); // * Verifica se o valor retornado é igual ao valor definido
        });

        it("shouldn't be able to create a Role", async () => {
            const role: Role = {
                id: randomUUID().toString(),
                name: "Teste",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            prismaMock.role.create.mockRejectedValue(new Error("Não foi possivel criar o cargo"));

            await expect(role_repository.create(role))
                .rejects
                .toBeInstanceOf(Error);
        });
    });

    describe("Get All Role", () => {
        it("should get all Roles", async () => {
            const uuid = randomUUID().toString();

            const role: Role = {
                id: uuid,
                name: "Teste 2",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            const role2: Role = {
                id: uuid,
                name: "Teste 2",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            prismaMock.role.findMany.mockResolvedValue([role, role2]);

            await expect(role_repository.getAll())
                .resolves
                .toContain(role);
        });
    });

    describe("Get a Role by ID", () => {
        it("should get a Role Details by ID", async () => {
            const uuid = randomUUID().toString();

            const role: Role = {
                id: uuid,
                name: "Teste",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            prismaMock.role.findUnique.mockResolvedValue(role);

            await expect(role_repository.getById(role.id))
                .resolves
                .toEqual(role);
        });

        it("shouldn't be able to get Role by Invalid ID", async () => {

            prismaMock.role.findUnique.mockResolvedValue(null);

            await expect(role_repository.getById("Invalid ID"))
                .resolves
                .toBeNull();
        });
    });

    describe("Get a Role by NAME", () => {
        it("should get a Role Details by NAME", async () => {
            const uuid = randomUUID().toString();

            const role: Role = {
                id: uuid,
                name: "Teste",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            prismaMock.role.findUnique.mockResolvedValue(role);

            await expect(role_repository.getByName(role.name))
                .resolves
                .toEqual(role);
        });

        it("shouldn't get a Role Details by a non-used Name", async () => {
            const uuid = randomUUID().toString();

            prismaMock.role.findUnique.mockResolvedValue(null);

            await expect(role_repository.getByName("Non-used Name"))
                .resolves
                .toBe(null);
        });
    });

    describe("Update a Role", () => {
        it("should update a Role by ID", async () => {
            const uuid = randomUUID().toString();

            const role: Role = {
                id: uuid,
                name: "Teste",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            prismaMock.role.update.mockResolvedValue(role);

            await expect(role_repository.updateById(role.id, role))
                .resolves
                .toEqual(role);
        });

        it.todo("should update a role by NAME");
    });

    describe("Delete a Role", () => {
        it("should delete a Role by ID", async () => {
            const uuid = randomUUID().toString();

            const role: Role = {
                id: uuid,
                name: "Teste",
                description: "Teste",
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            prismaMock.role.delete.mockResolvedValue(role);

            await expect(role_repository.deleteById(role.id))
                .resolves
                .toEqual(role);
        });

        it.todo("should delete a role by NAME");
    });

    describe("Get Users by Role Name", () => {
        it.todo("Get Users by Role Name");
    });

    describe("Get Users by Role Id", () => {
        it.todo("Get Users by Role Id");
    });
});