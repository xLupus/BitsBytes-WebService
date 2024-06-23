import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { IRoleRepository } from "../../../types/role";

export class GetRoleByIdUseCase {
    role_repository: IRoleRepository;

    constructor(role_repository: IRoleRepository) {
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