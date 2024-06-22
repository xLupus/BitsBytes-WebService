/**
 * @jest-environment ./config/jest/prisma_test_environment
 */
import {IUserRepository} from "../../../types/user";
import {GetAllUsersUseCase} from "./get_all_users";
import {UserRepositoryPostgres} from "../../../repositories/postgres/user_repository";

describe("Get All Users Usecase", () => {
    let user_repository: IUserRepository;
    let get_all_users: GetAllUsersUseCase;


    beforeEach(() => {
        user_repository = new UserRepositoryPostgres()
        get_all_users = new GetAllUsersUseCase(user_repository)
    })

    it("should list all Users", async () => {
        const {error, users} = await get_all_users.execute()

        expect(error).toBeNull()
        expect(users).toBeTruthy()
    })
})