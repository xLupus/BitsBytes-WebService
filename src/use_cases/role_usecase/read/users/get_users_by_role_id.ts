import { RoleNotFoundError } from "../../../../http/esceptions/role-exceptions";
import { RoleRepository } from "../../../../types/role";

export class getUsersByRoleIdUseCase {
    role_repository: RoleRepository;

    constructor(role_repository: RoleRepository) {
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