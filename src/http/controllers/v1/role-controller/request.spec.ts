/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { RoleInput } from "../../../../types/role";
import { app } from "../../../../config/server";
import request from "supertest";

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
                name: "Gestor",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(role);

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({ name: "Updated" })
                .expect(200);

            expect(response.body.status).toBe(200);

        });

        it("shouldn't update a role that not exist", async () => {
            const role_id = randomUUID().toString();

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({ name: "Updated" })
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
                .send({ description: "" })
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("description");
        });

        it("shouldn't update a role with a name already being used", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "Usuario Comum",
                description: "Usuario Comum"
            };

            await request(app).post(request_url).send(role).expect(201);

            const response = await request(app).put(`${request_url}/${role_id}`)
                .send({ name: role.name })
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("name");
        });

    });

    describe(`DELETE ${api_version}/roles/role_id`, () => {
        it("should delete a role", async () => {
            const role_id = randomUUID().toString();

            const role: RoleInput = {
                id: role_id,
                name: "Usuario Comum",
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
        it.todo("should return a role details");
        it.todo("shouldn't return details from a invalid id");
    });
});