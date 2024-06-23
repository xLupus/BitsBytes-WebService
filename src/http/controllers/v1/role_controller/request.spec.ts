/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {randomUUID} from "crypto";
import {RoleInput} from "../../../../types/role";
import {app} from "../../../../config/server";
import request from "supertest";
import {faker} from "@faker-js/faker/locale/pt_BR";

describe("Role Controller", () => {
    const api_version = "/api/v1";
    const request_url = `${api_version}/roles`;

    describe(`GET ${api_version}/roles`, () => {
        it("should return all roles", async () => {
            const response = await request(app).get(request_url).expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("roles");
        });
    });

    describe(`GET ${api_version}/roles/role_id`, () => {
        it("should return a role details", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "Assinante",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(role);

            const response = await request(app).get(`${request_url}/${role_id}`);

            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("role");
        });

        it("shouldn't return details from a invalid id", async () => {
            const role_id = randomUUID().toString();

            const response = await request(app).get(`${request_url}/${role_id}`);

            expect(response.body.status).toBe(404);
        });
    });

    describe(`POST ${api_version}/roles`, () => {
        it("should create a role", async () => {
            const role: RoleInput = {
                name: "Gestor",
                description: "Responsavel por gerir o site"
            };

            const response = await request(app).post(request_url).send(role).expect(201);

            expect(response.body.status).toBe(201);
        });

        it("shouldn't create a role because validation", async () => {
            const role: RoleInput = {
                name: "Gestor",
                description: ""
            };

            const response = await request(app).post(request_url).send(role).expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body).toHaveProperty("errors");
        });

        it("shouldn't create a role with a name already being used", async () => {
            const role: RoleInput = {
                name: "Gerente",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(role).expect(201);

            const response = await request(app).post(request_url).send(role).expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.message);
        });
    });

    describe(`PUT ${api_version}/roles/role_id`, () => {
        it("should update a role", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "Avaliador",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(role);

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({name: "Updated"})

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);

        });

        it("shouldn't update a role that not exist", async () => {
            const role_id = randomUUID().toString();

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({name: "Updated"})
                .expect(404);

            expect(response.body.status).toBe(404);
        });

        it("shouldn't update a role because validation", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "Redator",
                description: "Responsavel por criar posts"
            };

            await request(app).post(request_url).send(role).expect(201);

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({description: ""})
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("description");
        });

        it("shouldn't update a role with a name already being used", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "CEO",
                description: "Usuario Comum"
            };

            await request(app).post(request_url).send(role);

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({name: role.name})

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("name");
        });

    });

    describe(`DELETE ${api_version}/roles/role_id`, () => {
        it("should delete a role", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "Usuario Normal",
                description: "Usuario Comum"
            };

            await request(app).post(request_url).send(role);

            const response = await request(app).delete(`${request_url}/${role_id}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
        });

        it("shouldn't delete a role that not exist", async () => {
            const role_id = randomUUID().toString();

            const response = await request(app).delete(`${request_url}/${role_id}`)
                .expect(404);

            expect(response.body.status).toBe(404);
            expect(response.body.errors).toBeUndefined();
        });
    });

    describe(`GET ${api_version}/roles/role_id/users`, () => {
        it("should return users from a role", async () => {
            const role = {
                id: randomUUID().toString(),
                name: faker.word.words(1),
                description: faker.word.words(10)
            }

            await request(app).post(request_url).send(role)

            for (let i = 0; i <= 1; i++)
                await request(app).post(`${api_version}/users`).send({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.word.words(2),
                    role_id: role.id
                })

            const response = await request(app).get(`${request_url}/${role.id}/users`)

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("users")
            expect(response.body.data.users).toHaveLength(2)
        });

        it("shouldn't return details from a invalid id", async () => {
            const role_id = randomUUID().toString();
            const response = await request(app).get(`${request_url}/${role_id}/users`)

            expect(response.status).toBe(404);
            expect(response.body.status).toBe(404);
            expect(response.body.errors).toHaveProperty("role");
        });
    });
});