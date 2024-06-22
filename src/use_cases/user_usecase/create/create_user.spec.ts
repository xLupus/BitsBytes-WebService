/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {IUserRepository, UserInput} from "../../../types/user";
import {CreateUserUseCase} from "./create_user";
import {UserRepositoryPostgres} from "../../../repositories/postgres/user_repository";
import {UserEmailAlreadyBeingUsedError, UserValidationError} from "../../../http/exceptions/user_exceptions";
import {RoleRepositoryPostgres} from "../../../repositories/postgres/role_repository";
import {CreateRoleUseCase} from "../../role_usecase/create/create_role";
import {randomUUID} from "crypto";
import {IRoleRepository} from "../../../types/role";
import {RoleNotFoundError} from "../../../http/exceptions/role-exceptions";

describe("Create User Usecase", () => {
    let user_repository: IUserRepository
    let role_repository: IRoleRepository
    let create_user: CreateUserUseCase
    let role_id: string

    beforeAll(async () => {
        role_id = randomUUID().toString()

        const create_role = new CreateRoleUseCase(new RoleRepositoryPostgres());

        await create_role.execute({
            id: role_id,
            name: "Lorem Ipsum",
            description: "Lorem Ipsum",
        })
    })

    beforeEach(() => {
        user_repository = new UserRepositoryPostgres()
        role_repository = new RoleRepositoryPostgres()
        create_user = new CreateUserUseCase(user_repository, role_repository)
    })

    it("should be able to create a new user", async () => {
        const user = {
            name: "Vinicius",
            email: "vinicius@gmail.com",
            password: "12345678",
            role_id: role_id
        }

        const {error, isCreated} = await create_user.execute(user);

        expect(error).toBeNull();
        expect(isCreated).toBe(true);
    })

    it("shouldn't be able to create a user with an used email", async () => {
        const user = {
            name: "Victor",
            email: "victor@gmail.com",
            password: "12345678",
            role_id: role_id
        }

        await create_user.execute(user);
        const {error, isCreated} = await create_user.execute(user);

        expect(error).toBeInstanceOf(UserEmailAlreadyBeingUsedError);
        expect(isCreated).toBe(false);

    })

    it("shouldn't be able to create a user because input validation", async () => {
        const user = {
            name: "Lucas",
            email: "lucasgmail.com",
            password: "12345678",
            role_id: role_id
        }

        const {error, isCreated} = await create_user.execute(user);

        expect(error).toBeInstanceOf(UserValidationError);
        expect(isCreated).toBe(false);
    })

    it("shouldn't be able to create a user because an omit input", async () => {
        const user = {
            email: "thiago@gmail.com",
            password: "12345678",
            role_id: role_id
        }

        const {error, isCreated} = await create_user.execute(user as UserInput);

        expect(error).toBeInstanceOf(UserValidationError);
        expect(isCreated).toBe(false);
    })

    it("shouldn't be able to create a user by a invalid role id", async () => {
        const user = {
            name: "Thiago",
            email: "thiago@gmail.com",
            password: "12345678",
            role_id: randomUUID().toString()
        }

        const {error, isCreated} = await create_user.execute(user)

        expect(error).toBeInstanceOf(RoleNotFoundError)
        expect(isCreated).toBe(false)
    })
})