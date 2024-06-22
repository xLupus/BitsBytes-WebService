/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {IUserRepository, UserInput} from "../../../types/user";
import {IRoleRepository} from "../../../types/role";
import {UserRepositoryPostgres} from "../../../repositories/postgres/user_repository";
import {RoleRepositoryPostgres} from "../../../repositories/postgres/role_repository";
import {faker} from "@faker-js/faker/locale/pt_BR";
import {CreateRoleUseCase} from "../../role_usecase/create/create_role";
import {randomUUID} from "crypto";
import {UpdateUserByEmailUseCase} from "./update_user_by_email";
import {CreateUserUseCase} from "../create/create_user";
import {
    UserEmailAlreadyBeingUsedError,
    UserNotFoundError,
    UserValidationError
} from "../../../http/exceptions/user_exceptions";
import {RoleNotFoundError} from "../../../http/exceptions/role-exceptions";

describe("Update User By NAME Use Case", () => {
    let update_user_by_email: UpdateUserByEmailUseCase
    let user_repository: IUserRepository
    let role_repository: IRoleRepository

    let role_id = randomUUID().toString()

    const user: UserInput = {
        name: "",
        email: "",
        password: "",
        active: true,
        role_id
    }

    beforeAll(async () => {
        const create_role = new CreateRoleUseCase(new RoleRepositoryPostgres())

        await create_role.execute({
            id: role_id,
            name: faker.word.words(1),
            description: faker.lorem.words(5),
        })
    })

    beforeEach(() => {
        user_repository = new UserRepositoryPostgres()
        role_repository = new RoleRepositoryPostgres()
        update_user_by_email = new UpdateUserByEmailUseCase(user_repository, role_repository)
    })

    beforeEach(async () => {
        const create_user = new CreateUserUseCase(user_repository, role_repository)

        user.name = faker.person.fullName()
        user.email = faker.internet.email()
        user.password = faker.word.words(2)

        await create_user.execute({
            name: user.name,
            email: user.email,
            password: user.password,
            role_id: role_id
        })
    })

    it("should be able to update a user", async () => {
        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            name: faker.person.fullName()
        })

        expect(error).toBeNull()
        expect(isUpdated).toBe(true)
    })

    it("shouldn't be able to update a user with an invalid Email", async () => {
        const random_email = faker.internet.email()
        const {error, isUpdated} = await update_user_by_email.execute(random_email, {
            name: faker.person.fullName(),
        })

        expect(error).toBeInstanceOf(UserNotFoundError)
        expect(isUpdated).toBe(false)
    })

    it("should be able to update a user email", async () => {
        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            email: faker.internet.email()
        })

        expect(error).toBeNull()
        expect(isUpdated).toBe(true)
    })

    it("shouldn't be able to update a user with an used email", async () => {
        // TODO - Criar email antes

        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            email: user.email
        })

        expect(error).toBeInstanceOf(UserEmailAlreadyBeingUsedError)
        expect(isUpdated).toBe(false)
    })

    it("shouldn't be able to update a user by Invalid Email", async () => {
        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            email: faker.person.fullName()
        })

        expect(error).toBeInstanceOf(UserValidationError)
        expect(isUpdated).toBe(false)
    })

    it("should be able to update a user password", async () => {
        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            password: faker.word.words(2)
        })

        expect(error).toBeNull()
        expect(isUpdated).toBe(true)
    })

    it("should be able to update a user role", async () => {
        const create_role = new CreateRoleUseCase(role_repository)
        const role_uuid = randomUUID().toString()

        await create_role.execute({
            id: role_uuid,
            name: faker.word.words(1),
            description: faker.word.words(5)
        })

        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            role_id: role_uuid
        })

        expect(error).toBeNull()
        expect(isUpdated).toBe(true)
    })

    it("shouldn't be able to update a user with an un-exist role", async () => {
        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            role_id: randomUUID().toString()
        })

        expect(error).toBeInstanceOf(RoleNotFoundError)
        expect(isUpdated).toBe(false)
    })

    it("shouldn't be able to update a user by an empty input", async () => {
        const {error, isUpdated} = await update_user_by_email.execute(user.email, {
            name: ""
        })

        expect(error).toBeInstanceOf(UserValidationError)
        expect(isUpdated).toBe(false)
    })
})