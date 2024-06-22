import {UserEmailAlreadyBeingUsedError, UserValidationError} from "../../../http/exceptions/user_exceptions";
import {create_user_schema} from "../../../http/schemas/user_schemas";
import bcrypt from "bcryptjs"
import {UserInput, IUserRepository} from "../../../types/user";
import {IRoleRepository} from "../../../types/role";
import {RoleNotFoundError} from "../../../http/exceptions/role-exceptions";

export class CreateUserUseCase {
    user_repository: IUserRepository
    role_repository: IRoleRepository

    constructor(user_repository: IUserRepository, role_repository: IRoleRepository) {
        this.user_repository = user_repository
        this.role_repository = role_repository
    }

    execute = async (user_data: UserInput) => {
        const user_data_validation = await create_user_schema.safeParseAsync(user_data)

        if (!user_data_validation.success)
            return {
                error: new UserValidationError(user_data_validation.error.formErrors.fieldErrors),
                isCreated: false
            }

        const {id, name, email, password, active, role_id} = user_data_validation.data

        try {
            const user_exist = await this.user_repository.getByEmail(email)

            if (user_exist)
                return {
                    error: new UserEmailAlreadyBeingUsedError(), isCreated: false
                }
        } catch (error) {
            return {
                error: error, isCreated: false
            }
        }

        try {
            const role_exist = await this.role_repository.getById(role_id)

            if (!role_exist)
                return {
                    error: new RoleNotFoundError(), isCreated: false
                }
        } catch (error) {
            return {
                error: error, isCreated: false
            }
        }

        const salt = await bcrypt.genSalt()
        const password_hash = await bcrypt.hash(password, salt)

        try {
            await this.user_repository.create({
                id,
                name,
                email,
                password: password_hash,
                active,
                role_id
            })

            return {
                error: null, isCreated: true
            }
        } catch (error) {
            return {
                error: error, isCreated: false
            }
        }
    }
}