import { UserValidationError } from "../../http/exceptions/user-exceptions";
import { create_user_schema } from "../../http/schemas/user_schemas";
import bcrypt from "bcryptjs"
import { UserInput, UserRepository } from "../../types/user";

export class CreateUserUseCase {
    userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    execute = async (user_data: UserInput) => {
        const user_data_validation = await create_user_schema.safeParseAsync(user_data)

        if (!user_data_validation.success) {
            const validationError = new UserValidationError(user_data_validation.error.formErrors.fieldErrors)

            return [validationError, false]
        }

        const salt = await bcrypt.genSalt()

        const password_hash = await bcrypt.hash(user_data.password, salt)

        try {
            await this.userRepository.create({ ...user_data, password: password_hash })

            return [null, true]
        } catch (error) {
            // TODO: Identificar erros do prisma e converter para erros da aplicação
            return [error, false]
        }
    }
}