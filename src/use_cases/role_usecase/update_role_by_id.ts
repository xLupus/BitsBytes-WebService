import { RoleNameAlreadyBeingUsedError, RoleNotFoundError, RoleValidationError } from "../../http/esceptions/role-exceptions";
import { update_role_schema } from "../../http/schemas/role_schemas";
import { RoleRepository, RoleUpdateInput } from "../../types/role";

export class UpdateRoleByIdUseCase {
    role_repository: RoleRepository

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository
    }

    execute = async (role_id: string, role_data: RoleUpdateInput) => {
        const role_data_validation = await update_role_schema.safeParseAsync(role_data)

        if (!role_data_validation.success) {
            const validation_error = new RoleValidationError(role_data_validation.error.formErrors.fieldErrors)

            return [validation_error, false]
        }

        const role_data_validated = role_data_validation.data

        try {
            const role = await this.role_repository.getById(role_id)

            if (!role)
                return [new RoleNotFoundError(), false]

        } catch (error) {
            console.log(error)

            return [error, false]
        }

        if (role_data_validated.name) {
            try {
                const role = await this.role_repository.getByName(role_data_validated.name)

                if (role)
                    return [new RoleNameAlreadyBeingUsedError(), false]
            } catch (error) {
                console.log(error)

                return [error, false]
            }
        }

        try {
            await this.role_repository.updateById(role_id, role_data_validated)

            return [null, true]
        } catch (error) {
            return [error, false]
        }
    }
}