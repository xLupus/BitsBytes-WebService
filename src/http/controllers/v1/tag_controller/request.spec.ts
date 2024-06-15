/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import { randomUUID } from "crypto";
import { TagInput } from "../../../../types/tag";
import { app } from "../../../../config/server";
import request from "supertest";

describe("Tag Controller", () => {
    const api_version = "/api/v1";
    const request_url = `${api_version}/tags`;

    describe(`GET ${api_version}/tags`, () => {
        it("should return all tags", async () => {
            const response = await request(app).get(request_url).expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("tags");
        });
    });

    describe(`GET ${api_version}/tags/tag_id`, () => {
        it("should return a tag details", async () => {
            const tag_id = randomUUID().toString();

            const tag: TagInput = {
                id: tag_id,
                name: "Assinante",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(tag);

            const response = await request(app).get(`${request_url}/${tag_id}`);

            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("tag");
        });

        it("shouldn't return details from a invalid id", async () => {
            const tag_id = randomUUID().toString();

            const response = await request(app).get(`${request_url}/${tag_id}`);

            expect(response.body.status).toBe(404);
        });
    });

    describe(`POST ${api_version}/tags`, () => {
        it("should create a tag", async () => {
            const tag: TagInput = {
                name: "Gestor",
                description: "Responsavel por gerir o site"
            };

            const response = await request(app).post(request_url).send(tag).expect(201);

            expect(response.body.status).toBe(201);
        });

        it("shouldn't create a tag because validation", async () => {
            const tag: TagInput = {
                name: "Gestor",
                description: ""
            };

            const response = await request(app).post(request_url).send(tag).expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body).toHaveProperty("errors");
        });

        it("shouldn't create a tag with a name already being used", async () => {
            const tag: TagInput = {
                name: "Gerente",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(tag).expect(201);

            const response = await request(app).post(request_url).send(tag).expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.message);
        });
    });

    describe(`PUT ${api_version}/tags/tag_id`, () => {
        it("should update a tag", async () => {
            const tag_id = randomUUID().toString();

            const tag: TagInput = {
                id: tag_id,
                name: "Avaliador",
                description: "Responsavel por gerir o site"
            };

            await request(app).post(request_url).send(tag);

            const response = await request(app).put(`${request_url}/${tag_id}`)
                .send({ name: "Updated" })

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);

        });

        it("shouldn't update a tag that not exist", async () => {
            const tag_id = randomUUID().toString();

            const response = await request(app).put(`${request_url}/${tag_id}`)
                .send({ name: "Updated" })
                .expect(404);

            expect(response.body.status).toBe(404);
        });

        it("shouldn't update a tag because validation", async () => {
            const tag_id = randomUUID().toString();

            const tag: TagInput = {
                id: tag_id,
                name: "Redator",
                description: "Responsavel por criar posts"
            };

            await request(app).post(request_url).send(tag).expect(201);

            const response = await request(app).put(`${request_url}/${tag_id}`)
                .send({ description: "" })
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("description");
        });

        it("shouldn't update a tag with a name already being used", async () => {
            const tag_id = randomUUID().toString();

            const tag: TagInput = {
                id: tag_id,
                name: "CEO",
                description: "Usuario Comum"
            };

            await request(app).post(request_url).send(tag);

            const response = await request(app).put(`${request_url}/${tag_id}`)
                .send({ name: tag.name })

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("name");
        });

    });

    describe(`DELETE ${api_version}/tags/tag_id`, () => {
        it("should delete a tag", async () => {
            const tag_id = randomUUID().toString();

            const tag: TagInput = {
                id: tag_id,
                name: "Usuario Normal",
                description: "Usuario Comum"
            };

            await request(app).post(request_url).send(tag);

            const response = await request(app).delete(`${request_url}/${tag_id}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
        });

        it("shouldn't delete a tag that not exist", async () => {
            const tag_id = randomUUID().toString();

            const response = await request(app).delete(`${request_url}/${tag_id}`)
                .expect(404);

            expect(response.body.status).toBe(404);
            expect(response.body.errors).toBeUndefined();
        });
    });

    describe(`GET ${api_version}/tags/tag_id/users`, () => {
        it.todo("should return a tag details");
        it.todo("shouldn't return details from a invalid id");
    });
});