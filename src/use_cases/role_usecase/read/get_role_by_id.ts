import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { RoleRepository } from "../../../types/role";

export class GetRoleByIdUseCase {
    role_repository: RoleRepository;

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository;
    }

    execute = async (role_id: string) => {
        try {
            const role = await this.role_repository.getById(role_id);

            if (!role)
                return {
                    error: new RoleNotFoundError(), role: null
                };

            return {
                error: null, role: role
            };
        } catch (error) {
            return {
                error: error, role: null
            };
        }
    };
}