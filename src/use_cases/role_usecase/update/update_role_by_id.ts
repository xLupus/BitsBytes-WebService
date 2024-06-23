import { RoleNameAlreadyBeingUsedError, RoleNotFoundError, RoleValidationError } from "../../../http/exceptions/role-exceptions";
import { update_role_schema } from "../../../http/schemas/role_schemas";
import { IRoleRepository, RoleUpdateInput } from "../../../types/role";

export class UpdateRoleByIdUseCase {
    role_repository: IRoleRepository;

    constructor(role_repository: IRoleRepository) {
        this.role_repository = role_repository;
    }

    execute = async (role_id: string, role_data: RoleUpdateInput) => {
        const role_data_validation = await update_role_schema.safeParseAsync(role_data);

        if (!role_data_validation.success)
            return {
                error: new RoleValidationError(role_data_validation.error.formErrors.fieldErrors),
                isUpdated: false
            };

        const role_data_validated = role_data_validation.data;

        try {
            const role = await this.role_repository.getById(role_id);

            if (!role)
                return {
                    error: new RoleNotFoundError(),
                    isUpdated: false
                };


        } catch (error) {
            return {
                error: error, isUpdated: false
            };
        }

        if (role_data_validated.name) {
            try {
                const role = await this.role_repository.getByName(role_data_validated.name);

                if (role)
                    return {
                        error: new RoleNameAlreadyBeingUsedError(),
                        isUpdated: false
                    };
            } catch (error) {
                return {
                    error: error, isUpdated: false
                };
            }
        }

        try {
            await this.role_repository.updateById(role_id, role_data_validated);

            return {
                error: null, isUpdated: true
            };
        } catch (error) {
            return {
                error: error, isUpdated: false
            };
        }
    };
}