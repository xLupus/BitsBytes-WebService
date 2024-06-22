/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {IUserRepository} from "../../../types/user";
import {UserRepositoryPostgres} from "../../../repositories/postgres/user_repository";
import {GetUserByEmailUseCase} from "./get_user_by_email";
import {CreateRoleUseCase} from "../../role_usecase/create/create_role";
import {RoleRepositoryPostgres} from "../../../repositories/postgres/role_repository";
import {randomUUID} from "crypto";
import {CreateUserUseCase} from "../create/create_user";
import {UserNotFoundError} from "../../../http/exceptions/user_exceptions";

describe("Get User By Id Use Case", () => {
    let user_repository: IUserRepository;
    let get_user_by_email: GetUserByEmailUseCase
    const role_id = randomUUID().toString()

    beforeEach(() => {
        user_repository = new UserRepositoryPostgres();
        get_user_by_email = new GetUserByEmailUseCase(user_repository)
    })

    beforeAll(async () => {
        const create_role = new CreateRoleUseCase(new RoleRepositoryPostgres());

        await create_role.execute({
            id: role_id,
            name: "Lorem Ipsum",
            description: "Lorem Ipsum",
        })
    })

    it("should be able to get the user by email", async () => {
        const user_email = "lorem@gmail.com"

        const role_repository = new RoleRepositoryPostgres()
        const create_user = new CreateUserUseCase(user_repository, role_repository)

        await create_user.execute({
            name: "Lorem",
            email: user_email,
            password: "12345678",
            role_id
        })

        const {error, user} = await get_user_by_email.execute(user_email);

        expect(error).toBeNull()
        expect(user).toHaveProperty("id")
    });

    it("shouldn't be able to get the user by an un-exist email", async () => {
        const {error, user} = await get_user_by_email.execute("naoexiste@gmail.com")

        expect(error).toBeInstanceOf(UserNotFoundError);
        expect(user).toBeNull()
    });

    it("shouldn't be able to get the user by an empty email", async () => {
        const {error, user} = await get_user_by_email.execute("");

        expect(error).toBeInstanceOf(UserNotFoundError);
        expect(user).toBeNull()
    });
})