import {IUserRepository} from "../../../types/user";
import {UserNotFoundError} from "../../../http/exceptions/user_exceptions";

export class GetUserByIdUseCase {
    user_repository: IUserRepository

    constructor(user_repository: IUserRepository) {
        this.user_repository = user_repository;
    }

    execute = async (user_id: string) => {
        try {
            const user = await this.user_repository.getById(user_id);

            if (!user)
                return {
                    error: new UserNotFoundError(), user: null
                }

            return {
                error: null, user: user
            }
        } catch (error) {
            return {
                error: error, user: null
            }
        }
    }
}