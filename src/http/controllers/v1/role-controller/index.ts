import { Request, Response } from "express";
import { HttpResponseFormat } from "../../../../types/types";
import { RoleGetAllOptions, RoleInput } from "../../../../types/role";
import { RoleRepositoryPostgres } from "../../../../repositories/postgres/role_repository";
import { CreateRoleUseCase } from "../../../../use_cases/role_usecase/create/create_role";
import { GetAllRolesUseCase } from "../../../../use_cases/role_usecase/read/get_all_roles";
import { GetRoleByIdUseCase } from "../../../../use_cases/role_usecase/read/get_role_by_id";
import { RoleNameAlreadyBeingUsedError, RoleNotFoundError, RoleValidationError } from "../../../exceptions/role-exceptions";
import { UpdateRoleByIdUseCase } from "../../../../use_cases/role_usecase/update/update_role_by_id";
import { DeleteRoleByIdUseCase } from "../../../../use_cases/role_usecase/delete/delete_role_by_id";
import { getUsersByRoleIdUseCase } from "../../../../use_cases/role_usecase/read/users/get_users_by_role_id";
import { logger } from "../../../../config/logging";

export class RoleController {
    getAll = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`,);

        const response_body: HttpResponseFormat = { status: 200, message: "Lista de cargos" };
        const get_all_roles_options: RoleGetAllOptions = {};
        const { filter, order, skip, take } = req.query;

        if (filter) {
            const [filterColumn, filterValue] = filter.toString().split(":");

            if (filterColumn == "name")
                get_all_roles_options.filter = { column: "name", value: filterValue };
        }

        if (order) {
            const order_column = order.toString().substring(1);
            const order_operator = order.toString()[0];

            if (order_column == "name")
                get_all_roles_options.order = { column: "name", order_operator: order_operator == '-' ? 'desc' : 'asc' };
        }

        if (!isNaN(Number(skip)))
            get_all_roles_options.paginate = { skip: Number(skip) };

        if (!isNaN(Number(take)))
            get_all_roles_options.paginate = { ...get_all_roles_options.paginate, take: Number(take) };

        const roleRepository = new RoleRepositoryPostgres();
        const get_all_roles_usecase = new GetAllRolesUseCase(roleRepository);

        logger.info("Trying to get roles");
        const { error, roles } = await get_all_roles_usecase.execute(get_all_roles_options);

        if (error) { // TODO: Arrumar a resposta de Erros
            logger.error("Failed to get roles " + error);

            response_body.status = 500;
            response_body.message = "Erro Interno";
        }

        logger.info("Roles got successfully");
        response_body.data = { roles };

        logger.info(`${request_path} - Request finished`);
        return res.status(response_body.status).json(response_body);
    };

    getById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const response_body: HttpResponseFormat = { status: 200, message: "Detalhes de Cargo" };
        const { role_id } = req.params;

        const role_repository = new RoleRepositoryPostgres();
        const get_role_by_id_usecase = new GetRoleByIdUseCase(role_repository);

        logger.info("Trying to get the role details");
        const { error, role } = await get_role_by_id_usecase.execute(role_id);

        if (error) {
            if (error instanceof RoleNotFoundError) {
                logger.error(`Role not found`);

                response_body.status = 404;
                response_body.message = "Cargo não encontrado";
            } else {
                logger.error(`Internal Error`);

                response_body.status = 500;
                response_body.message = "Erro Interno";
            }

            return res.status(response_body.status).json(response_body);
        }

        logger.info("Roles got successfully");
        logger.info(`${request_path} - Request finished`);

        response_body.data = { role };

        return res.status(response_body.status).json(response_body);
    };

    create = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const response_body: HttpResponseFormat = {
            status: 201,
            message: "Cargo criado com sucesso"
        };

        const roleInput: RoleInput = req.body;

        const role_repository = new RoleRepositoryPostgres();
        const create_role_usecase = new CreateRoleUseCase(role_repository);

        logger.info(`Trying to create a role`);
        const { error, isCreated } = await create_role_usecase.execute(roleInput);

        if (isCreated) {
            logger.info("Roles create successfully");
            logger.info(`${request_path} - Request finished`);
            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error creating a role`);

            if (error instanceof RoleValidationError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = "Valor invalidos";
                response_body.errors = error.cause as object;
            } else if (error instanceof RoleNameAlreadyBeingUsedError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = "O nome do cargo já está sendo utilizado";
            } else {
                logger.error("Internal Server Error");

                response_body.status = 500;
                response_body.message = "Erro interno no servidor";
            }

            logger.info(`${request_path} - Request finished`);
            return res.status(response_body.status).json(response_body);
        }
    };

    updateById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const { role_id } = req.params;

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Cargo Atualizado com sucesso"
        };

        const role_repository = new RoleRepositoryPostgres();
        const update_role_by_id_usecase = new UpdateRoleByIdUseCase(role_repository);

        logger.info(`Trying to update the role`);
        const { error, isUpdated } = await update_role_by_id_usecase.execute(role_id, req.body);

        if (isUpdated) {
            logger.info(`Role updated succefully`);
            logger.info(`${request_path} - Request finished`);

            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error updating the role`);

            if (error instanceof RoleNotFoundError) {
                logger.error(error.name);
                response_body.status = 404;
                response_body.message = "Cargo não encontrado";
            } else if (error instanceof RoleValidationError) {
                logger.error(error.name);
                response_body.status = 400;
                response_body.message = "Cargo não encontrado";
                response_body.errors = error.cause as object;
            } else if (error instanceof RoleNameAlreadyBeingUsedError) {
                logger.error(error.name);
                response_body.status = 400;
                response_body.message = "O nome de cargo já está sendo utilizado ";
            } else {
                response_body.status = 500;
                response_body.message = "Internal Server Error";
                response_body.errors = error as object;
            }
        }

        logger.info(`${request_path} - Request finished`);
        return res.status(response_body.status).json(response_body);
    };

    deleteById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const { role_id } = req.params;

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Cargo Apagado com sucesso"
        };

        const role_repository = new RoleRepositoryPostgres();
        const delete_role_by_id_usecase = new DeleteRoleByIdUseCase(role_repository);

        logger.info(`Trying to delete the role`);
        const { error, isDeleted } = await delete_role_by_id_usecase.execute(role_id);

        if (isDeleted) {
            logger.info(`Role deleted succefully`);
            logger.info(`${request_path} - Request finished`);
            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error updating the role`);

            if (error instanceof RoleNotFoundError) {
                logger.error(error.name);
                response_body.status = 404;
                response_body.message = "Cargo não encontrado";
            } else {
                response_body.status = 500;
                response_body.message = "Internal Server Error";
                response_body.errors = error as object;
            }
        }

        logger.info(`${request_path} - Request finished`);
        return res.status(response_body.status).json(response_body);
    };

    getUsersByRoleId = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const { role_id } = req.params;

        const response_body: HttpResponseFormat = {
            status: 200,
            message: `Usuarios da role de ID: ${role_id}`
        };

        const role_repository = new RoleRepositoryPostgres();
        const get_users_by_role_id_usecase = new getUsersByRoleIdUseCase(role_repository);

        logger.info(`Trying to get the users from the role`);
        const { error, users } = await get_users_by_role_id_usecase.execute(role_id);

        if (users) {
            logger.info(`Users from role ${role_id} got successfully`);
            logger.info(`${request_path} - Request finished`);

            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error getting the users from the role`);

            if (error instanceof RoleNotFoundError) {
                logger.error(error.name);
                response_body.status = 404;
                response_body.message = "Cargo não encontrado";
            } else {
                response_body.status = 500;
                response_body.message = "Internal Server Error";
                response_body.errors = error as object;
            }
        }

        logger.info(`${request_path} - Request finished`);
        return res.status(response_body.status).json(response_body);
    };
}