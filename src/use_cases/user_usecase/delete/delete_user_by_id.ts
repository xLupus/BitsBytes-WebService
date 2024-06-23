import {IUserRepository} from "../../../types/user";
import {UserNotFoundError} from "../../../http/exceptions/user_exceptions";

export class DeleteUserByIdUseCase {
    private user_repository: IUserRepository;

    constructor(user_repository: IUserRepository) {
        this.user_repository = user_repository;
    }

    execute = async (user_id: string) => {
        try {
            const user = await this.user_repository.getById(user_id);

            if (!user)
                return {
                    error: new UserNotFoundError(), isDeleted: false
                }
        } catch (error) {
            return {
                error: error, isDeleted: false
            }
        }

        try {
            await this.user_repository.deleteById(user_id);

            return {
                error: null, isDeleted: true
            }
        } catch (error) {
            return {
                error: error, isDeleted: false
            }
        }
    }
}