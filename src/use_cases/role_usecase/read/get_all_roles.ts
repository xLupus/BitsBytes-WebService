import { RoleGetAllOptions, RoleRepository } from "../../../types/role";

export class GetAllRolesUseCase {
    roleRepository: RoleRepository;

    constructor(roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    execute = async (options?: RoleGetAllOptions) => {
        try {
            const roles = await this.roleRepository.getAll(options);

            return {
                error: null, roles: roles
            };
        } catch (error) {
            return {
                error: error, roles: null
            };
        }
    };
}