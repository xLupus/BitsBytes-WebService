import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { IRoleRepository } from "../../../types/role";

export class DeleteRoleByIdUseCase {
    role_repository: IRoleRepository;

    constructor(role_repository: IRoleRepository) {
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