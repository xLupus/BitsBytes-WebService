import { RoleNotFoundError } from "../../../../http/exceptions/role-exceptions";
import { IRoleRepository } from "../../../../types/role";

export class GetUsersByRoleIdUseCase {
    role_repository: IRoleRepository;

    constructor(role_repository: IRoleRepository) {
        this.role_repository = role_repository;
    }

    execute = async (role_id: string) => {
        try {
            const role = await this.role_repository.getById(role_id);

            if (!role)
                return {
                    error: new RoleNotFoundError(), users: null
                };
        } catch (error) {
            return {
                error: error, users: null
            };
        }

        try {
            const users = await this.role_repository.getUsersByRoleId(role_id);

            return {
                error: null, users: users
            };
        } catch (error) {
            return {
                error: error, users: null
            };
        }
    };
}