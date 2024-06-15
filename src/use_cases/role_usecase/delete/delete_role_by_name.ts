import { RoleNotFoundError } from "../../../http/exceptions/role-exceptions";
import { RoleRepository } from "../../../types/role";

export class DeleteRoleByNameUseCase {
    role_repository: RoleRepository;

    constructor(role_repository: RoleRepository) {
        this.role_repository = role_repository;
    }

    execute = async (role_name: string) => {
        try {
            const role = await this.role_repository.getByName(role_name);

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
            await this.role_repository.deleteByName(role_name);

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