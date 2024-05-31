import { RoleValidationError } from "../../http/esceptions/role-exceptions";
import { create_role_schema } from "../../http/schemas/role_schemas";
import { RoleRepository, RoleInput } from "../../types/role"; 

export class CreateRoleUseCase {
    roleRepository: RoleRepository

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository
    }

    execute = async (role_data: RoleInput) => {
        const role_data_validation = await create_role_schema.safeParseAsync(role_data)

        // TODO: Validar se o nome da role ja esta sendo usado - retirar do zod

        if (!role_data_validation.success) {
            const validationError = new RoleValidationError(role_data_validation.error.formErrors.fieldErrors)

            return [validationError, false]
        }

        try {
            await this.roleRepository.create(role_data)

            return [null, true]

        } catch (error) {
            console.log(error)

            return [error, false]
        }
    }
}