import { RoleNameAlreadyBeingUsedError, RoleValidationError } from "../../../http/exceptions/role-exceptions";
import { create_role_schema } from "../../../http/schemas/role_schemas";
import { RoleRepository, RoleInput } from "../../../types/role";

export class CreateRoleUseCase {
    role_repository: RoleRepository;

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository;
    }

    execute = async (role_data: RoleInput) => {
        const role_data_validation = await create_role_schema.safeParseAsync(role_data);

        if (!role_data_validation.success) {
            return {
                error: new RoleValidationError(role_data_validation.error.formErrors.fieldErrors),
                isCreated: false
            };
        }

        const role_data_validated = role_data_validation.data;

        try {
            const role = await this.role_repository.getByName(role_data_validated.name);

            if (role)
                return {
                    error: new RoleNameAlreadyBeingUsedError(),
                    isCreated: false
                };

        } catch (error) {
            console.log(error);

            return {
                error: error, isCreated: false
            };
        }

        try {
            await this.role_repository.create(role_data);

            return {
                error: null, isCreated: true
            };

        } catch (error) {
            console.log(error);

            return {
                error: error, isCreated: false
            };
        }
    };
}