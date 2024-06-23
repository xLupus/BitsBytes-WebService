/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {IUserRepository} from "../../../types/user";
import {DeleteUserByIdUseCase} from "./delete_user_by_id";
import {UserRepositoryPostgres} from "../../../repositories/postgres/user_repository";
import {CreateUserUseCase} from "../create/create_user";
import {randomUUID} from "crypto";
import {faker} from "@faker-js/faker/locale/pt_BR";
import {CreateRoleUseCase} from "../../role_usecase/create/create_role";
import {RoleRepositoryPostgres} from "../../../repositories/postgres/role_repository";
import {UserNotFoundError} from "../../../http/exceptions/user_exceptions";

describe("Delete User By Id Use Case", () => {
    let user_repository: IUserRepository;
    let delete_user_by_id: DeleteUserByIdUseCase

    beforeEach(() => {
        user_repository = new UserRepositoryPostgres()
        delete_user_by_id = new DeleteUserByIdUseCase(user_repository)
    })

    it("should delete a user", async () => {
        const role_repository = new RoleRepositoryPostgres()

        const create_role = new CreateRoleUseCase(role_repository);
        const create_user = new CreateUserUseCase(user_repository, role_repository);

        const user_id = randomUUID().toString();
        const role_id = randomUUID().toString();

        await create_role.execute({
            id: role_id,
            name: "Lorem",
            description: "Lorem Ipsum"
        })

        await create_user.execute({
            id: user_id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: "12345678",
            role_id
        })

        const {error, isDeleted} = await delete_user_by_id.execute(user_id)

        expect(error).toBeNull()
        expect(isDeleted).toBe(true)
    })

    it("shouldn't delete a user by a un-existing user", async () => {
        const {error, isDeleted} = await delete_user_by_id.execute(randomUUID.toString())

        expect(error).toBeInstanceOf(UserNotFoundError);
        expect(isDeleted).toBe(false);
    })

    it("shouldn't delete a user by an empty id", async () => {
        const {error, isDeleted} = await delete_user_by_id.execute("");

        expect(error).toBeInstanceOf(UserNotFoundError);
        expect(isDeleted).toBe(false);
    })
})