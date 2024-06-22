/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import request from "supertest"
import {app} from "../../../../config/server"
import {UserInput} from "../../../../types/user";
import {RoleRepositoryPostgres} from "../../../../repositories/postgres/role_repository";
import {CreateRoleUseCase} from "../../../../use_cases/role_usecase/create/create_role";
import {randomUUID} from "crypto";
import {faker} from "@faker-js/faker/locale/pt_BR";

describe("User Controller", () => {
    const base_url = "/api/v1/users"

    const role_id = randomUUID().toString()

    beforeAll(async () => {
        const role_repository = new RoleRepositoryPostgres()
        const create_role = new CreateRoleUseCase(role_repository)

        await create_role.execute({
            id: role_id,
            name: "Lorem",
            description: "Lorem ipsum dolor sit amet, consectetur",
        })
    })

    describe(`GET ${base_url}`, () => {
        it("should be able to get users ", async () => {
            const response = await request(app).get(base_url)

            expect(response.status).toBe(200)
            expect(response.body.status).toBe(200);
            expect(response.body.data).toHaveProperty("users");
        })
    })

    describe(`POST ${base_url}`, () => {
        it("should create a new user", async () => {
            const user: UserInput = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            const response = await request(app).post(base_url).send(user)

            expect(response.status).toBe(201)
            expect(response.body.status).toBe(201)
        })

        it("shouldn't create an user with an empty required input", async () => {
            const user = {
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            const response = await request(app).post(base_url).send(user)

            expect(response.status).toBe(400)
            expect(response.body.status).toBe(400)
            expect(response.body.errors).toHaveProperty("name")
        })

        it("shouldn't create an user with an unexisting role", async () => {
            const user = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: randomUUID().toString()
            }

            const response = await request(app).post(base_url).send(user)

            expect(response.status).toBe(400)
            expect(response.body.status).toBe(400)
            expect(response.body.errors).toHaveProperty("role")
        })

        it("shouldn't create an user with invalid email", async () => {
            const user: UserInput = {
                name: faker.person.fullName(),
                email: faker.person.jobTitle(),
                password: faker.word.words(2),
                role_id: role_id
            }

            const response = await request(app).post(base_url).send(user)

            expect(response.status).toBe(400)
            expect(response.body.status).toBe(400)
            expect(response.body.errors).toHaveProperty("email")
        })

        it("shouldn't create an user with an used email", async () => {
            const user: UserInput = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            await request(app).post(base_url).send(user)
            const response = await request(app).post(base_url).send(user)

            expect(response.status).toBe(400)
            expect(response.body.status).toBe(400)
            expect(response.body.errors).toHaveProperty("email")
        })
    })

    describe(`GET ${base_url}/user_id`, () => {
        it("should return a user", async () => {
            const user = {
                id: randomUUID().toString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id,
            }

            await request(app).post(base_url).send(user)
            const response = await request(app).get(`${base_url}/${user.id}`)

            expect(response.status).toBe(200)
            expect(response.body.status).toBe(200)
            expect(response.body.data).toHaveProperty("user")
        })

        it("shouldn't return a user by unexisting ID", async () => {
            const user_id = randomUUID().toString()

            const response = await request(app).get(`${base_url}/${user_id}`)

            expect(response.status).toBe(404)
            expect(response.body.status).toBe(404)
            expect(response.body.errors).toHaveProperty("user")
        })
    })

    describe(`PUT ${base_url}/user_id`, () => {
        it("should update a user", async () => {
            const user = {
                id: randomUUID().toString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            await request(app).post(base_url).send(user)

            const response = await request(app).put(`${base_url}/${user.id}`).send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
            })

            expect(response.status).toBe(200)
            expect(response.body.status).toBe(200)
        })

        it("shouldn't update an user by an unexisting ID", async () => {
            const user_id = randomUUID().toString()

            const response = await request(app).put(`${base_url}/${user_id}`).send({})

            expect(response.status).toBe(404)
            expect(response.body.status).toBe(404)
            expect(response.body.errors).toHaveProperty("user")
        })

        it("shouldn't update a user with an used email", async () => {
            const user = {
                id: randomUUID().toString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            await request(app).post(base_url).send(user)

            const response = await request(app).put(`${base_url}/${user.id}`).send({
                email: user.email,
            })

            expect(response.status).toBe(400)
            expect(response.body.status).toBe(400)
            expect(response.body.errors).toHaveProperty("email")
        })

        it("shouldn't update an user with an unexisting ROLE", async () => {
            const user = {
                id: randomUUID().toString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            await request(app).post(base_url).send(user)

            const response = await request(app).put(`${base_url}/${user.id}`).send({
                role_id: randomUUID().toString(),
            })

            expect(response.status).toBe(404)
            expect(response.body.status).toBe(404)
            expect(response.body.errors).toHaveProperty("role")
        })

        it("shouldn't update an user by validation error", async () => {
            const user = {
                id: randomUUID().toString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            await request(app).post(base_url).send(user)

            const response = await request(app).put(`${base_url}/${user.id}`).send({
                name: "",
                password: ""
            })

            expect(response.status).toBe(400)
            expect(response.body.status).toBe(400)
            expect(response.body.errors).toHaveProperty("name")
            expect(response.body.errors).toHaveProperty("password")
        })
    })

    describe(`DELETE ${base_url}/user_id`, () => {
        it("should delete a user", async () => {
            const user = {
                id: randomUUID().toString(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.word.words(2),
                role_id: role_id
            }

            await request(app).post(base_url).send(user)

            const response = await request(app).delete(`${base_url}/${user.id}`)

            expect(response.status).toBe(200)
            expect(response.body.status).toBe(200)
        })

        it("shouldn't delete a user by an unexisting ID", async () => {
            const user_id = randomUUID().toString();

            const response = await request(app).delete(`${base_url}/${user_id}`)

            expect(response.status).toBe(404)
            expect(response.body.status).toBe(404)
            expect(response.body.errors).toHaveProperty("user")
        })
    })
})