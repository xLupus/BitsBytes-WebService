/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import request from "supertest"
import {app} from "../../../../config/server";
import {randomUUID} from "crypto";

describe("Category Controller", () => {
    const api_version = "/api/v1";
    const request_url = `${api_version}/categories`;

    it.todo("Terminar os testes")

    describe("GET /api/v1/categories", () => {
        it("should list all categories", async () => {
            const response = await request(app).get(request_url);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("categories");
        })
    })

    describe("POST /api/v1/categories", () => {
        it("should create a new category and return a status 201", async () => {
            const category = {
                name: "Frontend",
                description: "Postagens para Frontend",
            }

            const response = await request(app).post(request_url).send(category)

            expect(response.status).toBe(201);
            expect(response.body.status).toBe(201);
            expect(response.body.errors).toBeUndefined();
        })

        it("shouldn't create a category because validation", async () => {
            const category = {
                name: "Category",
                description: ""
            };

            const response = await request(app).post(request_url).send(category).expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body).toHaveProperty("errors");
        });

        it("shouldn't create a category with a name already being used", async () => {
            const category = {
                name: "Backend",
                description: "Postagens para backend"
            };

            await request(app).post(request_url).send(category);

            const response = await request(app).post(request_url).send(category).expect(400);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(400);
            expect(response.body.message);
        });
    })

    describe("GET /api/v1/categories/:category_id", () => {
        it("should get a category by ID", async () => {
            const category_id = randomUUID().toString();

            const category = {
                id: category_id,
                name: "Desenvolvimento Web",
                description: "Postagens de Desenvolvimento Web em Geral",
            }

            await request(app).post(request_url).send(category)

            const response = await request(app).get(`${request_url}/${category_id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("category");
        })

        it("shouldn't return details from a invalid id", async () => {
            const category_id = randomUUID().toString();

            const response = await request(app).get(`${request_url}/${category_id}`);

            expect(response.body.status).toBe(404);
        });
    })

    describe("PUT /api/v1/categories/:category_id", () => {
        it("should update a category", async () => {
            const category_id = randomUUID().toString();

            const category = {
                id: category_id,
                name: "IA",
                description: "lorem ipsum"
            };

            await request(app).post(request_url).send(category);

            const response = await request(app).put(`${request_url}/${category_id}`)
                .send({name: "Updated"})
                .expect(200);

            expect(response.body.status).toBe(200);

        });

        it("shouldn't update a category that not exist", async () => {
            const category_id = randomUUID().toString();

            const response = await request(app).put(`${request_url}/${category_id}`)
                .send({name: "Updated"})
                .expect(404);

            expect(response.body.status).toBe(404);
        });

        it("shouldn't update a category because validation", async () => {
            const category_id = randomUUID().toString();

            const category = {
                id: category_id,
                name: "Mobile",
                description: "Mobile"
            };

            await request(app).post(request_url).send(category).expect(201);

            const response = await request(app).put(`${request_url}/${category_id}`)
                .send({description: ""})
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("description");
        });

        it("shouldn't update a category with a name already being used", async () => {
            const category_id = randomUUID().toString();

            const category = {
                id: category_id,
                name: "Desktop",
                description: "Lorem ipsum"
            };

            await request(app).post(request_url).send(category).expect(201);

            const response = await request(app).put(`${request_url}/${category_id}`)
                .send({name: category.name})
                .expect(400);

            expect(response.body.status).toBe(400);
            expect(response.body.errors).toHaveProperty("name");
        });

    })

    describe("DELETE /api/v1/categories/:category_id", () => {
        it("should delete a category", async () => {
            const category_id = randomUUID().toString();

            const category = {
                id: category_id,
                name: "Jogos",
                description: "Lorem ipsum"
            };

            await request(app).post(request_url).send(category);

            const response = await request(app).delete(`${request_url}/${category_id}`)
                .expect(200);

            expect(response.body.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
        });

        it("shouldn't delete a category that not exist", async () => {
            const category_id = randomUUID().toString();

            const response = await request(app).delete(`${request_url}/${category_id}`)
                .expect(404);

            expect(response.body.status).toBe(404);
            expect(response.body.errors).toBeUndefined();
        });
    })
})