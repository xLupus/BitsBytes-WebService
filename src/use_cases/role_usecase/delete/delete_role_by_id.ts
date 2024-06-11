import { RoleNotFoundError } from "../../../http/esceptions/role-exceptions";
import { RoleRepository } from "../../../types/role";

export class DeleteRoleByIdUseCase {
    role_repository: RoleRepository;

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository;
    }

    execute = async (role_id: string) => {
        try {
            const role = await this.role_repository.getById(role_id);

            if (!role)
                return {
                    error: new RoleNotFoundError(),
                    isDeleted: false
                };

        } catch (error) {
            console.log(error);

            return {
                error: error, isDeleted: false
            };
        }

        try {
            await this.role_repository.deleteById(role_id);

            return {
                error: null, isDeleted: true
            };
        } catch (error) {
            return {
                error: error, isDeleted: false
            };
        }
    };
}