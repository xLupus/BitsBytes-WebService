import { RoleNotFoundError } from "../../http/esceptions/role-exceptions";
import { RoleRepository } from "../../types/role";

export class GetRoleByIdUseCase {
    role_repository: RoleRepository

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository
    }

    execute = async (role_name: string) => {
        try {
            const role = await this.role_repository.getByName(role_name)

            if (!role) 
                return [new RoleNotFoundError(), null]

            return [null, role]
        } catch (error) {
            return [error, null]
        }
    }
}