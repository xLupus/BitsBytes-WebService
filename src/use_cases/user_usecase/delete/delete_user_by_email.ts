import {IUserRepository} from "../../../types/user";
import {UserNotFoundError} from "../../../http/exceptions/user_exceptions";

export class DeleteUserByEmailUseCase {
    private user_repository: IUserRepository;

    constructor(user_repository: IUserRepository) {
        this.user_repository = user_repository;
    }

    execute = async (user_email: string) => {
        try {
            const user = await this.user_repository.getByEmail(user_email);

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
            await this.user_repository.deleteByEmail(user_email);

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