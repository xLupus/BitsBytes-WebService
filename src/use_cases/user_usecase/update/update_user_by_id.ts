import {IUserRepository, UserUpdateInput} from "../../../types/user";
import {update_user_schema} from "../../../http/schemas/user_schemas";
import {
    UserEmailAlreadyBeingUsedError,
    UserNotFoundError,
    UserValidationError
} from "../../../http/exceptions/user_exceptions";
import bcrypt from "bcryptjs";
import {IRoleRepository} from "../../../types/role";
import {RoleNotFoundError} from "../../../http/exceptions/role-exceptions";

export class UpdateUserByIdUseCase {
    user_repository: IUserRepository;
    role_repository: IRoleRepository

    constructor(user_repository: IUserRepository, role_repository: IRoleRepository) {
        this.user_repository = user_repository;
        this.role_repository = role_repository
    }

    execute = async (user_id: string, user_data: UserUpdateInput) => {
        const user_data_validation = await update_user_schema.safeParseAsync(user_data);

        if (!user_data_validation.success)
            return {
                error: new UserValidationError(user_data_validation.error.formErrors.fieldErrors),
                isUpdated: false
            }

        try {
            const user = await this.user_repository.getById(user_id);

            if (!user)
                return {
                    error: new UserNotFoundError(), isUpdated: false
                }
        } catch (error) {
            return {
                error: error, isUpdated: false
            }
        }

        const {name, email, password, role_id, active} = user_data_validation.data

        const user_update_info: UserUpdateInput = {name, active}

        if (role_id) {
            const role = await this.role_repository.getById(role_id)

            if (!role)
                return {
                    error: new RoleNotFoundError(),
                    isUpdated: false
                }

            user_update_info.role_id = role_id
        }

        if (password) {
            const salt = await bcrypt.genSalt()

            user_update_info.password = await bcrypt.hash(password, salt)
        }

        if (email) {
            const user = await this.user_repository.getByEmail(email)

            if (user)
                return {
                    error: new UserEmailAlreadyBeingUsedError(),
                    isUpdated: false
                }

            user_update_info.email = email
        }

        try {
            await this.user_repository.updateById(user_id, user_update_info)

            return {
                error: null, isUpdated: true
            }
        } catch (error) {
            return {
                error: error, isUpdated: false
            }
        }
    }
}