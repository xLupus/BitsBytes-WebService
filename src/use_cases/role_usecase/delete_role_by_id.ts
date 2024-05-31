import { RoleRepository } from "../../types/role";

export class DeleteRoleByIdUseCase {
    role_repository: RoleRepository

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository
    }

    execute = async (role_id: string) => {
        try {
            await this.role_repository.deleteById(role_id)

            return [null, true]
        } catch (error) {
            return [error, false]
        }
    }
}