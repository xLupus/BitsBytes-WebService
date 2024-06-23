import { RoleGetAllOptions, IRoleRepository } from "../../../types/role";

export class GetAllRolesUseCase {
    roleRepository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
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