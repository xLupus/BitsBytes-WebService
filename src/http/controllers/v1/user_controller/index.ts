import {Request, Response} from "express";
import {HttpResponseFormat} from "../../../../types/types";
import {UserRepositoryPostgres} from "../../../../repositories/postgres/user_repository";
import {GetAllUsersUseCase} from "../../../../use_cases/user_usecase/read/get_all_users";
import {logger} from "../../../../config/logging";
import {CreateUserUseCase} from "../../../../use_cases/user_usecase/create/create_user";
import {RoleRepositoryPostgres} from "../../../../repositories/postgres/role_repository";
import {
    UserEmailAlreadyBeingUsedError,
    UserNotFoundError,
    UserValidationError
} from "../../../exceptions/user_exceptions";
import {RoleNotFoundError} from "../../../exceptions/role-exceptions";
import {GetUserByIdUseCase} from "../../../../use_cases/user_usecase/read/get_user_by_id";
import {UpdateUserByIdUseCase} from "../../../../use_cases/user_usecase/update/update_user_by_id";
import {DeleteUserByIdUseCase} from "../../../../use_cases/user_usecase/delete/delete_user_by_id";

export class UserController {
    private user_repository = new UserRepositoryPostgres()

    getAll = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "lista de usuarios"
        }

        logger.info("Trying to list users")
        const get_all_users = new GetAllUsersUseCase(this.user_repository)

        const {error, users} = await get_all_users.execute()

        if (users) {
            logger.info("Users listed successfully")
            response_body.data = {users}

            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
            return res.status(response_body.status).json(response_body)
        }

        if (error) {
            logger.error("Error getting all users")
            logger.error(error)

            response_body.status = 500
            response_body.message = "Erro Interno no Servidor"
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
        return res.status(response_body.status).json(response_body);
    }

    create = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 201,
            message: "Usuario criado com sucesso"
        }

        const create_user = new CreateUserUseCase(
            this.user_repository,
            new RoleRepositoryPostgres()
        )

        logger.info("Trying to create user")
        const {error, isCreated} = await create_user.execute(req.body)

        if (isCreated) {
            logger.info("User created successfully")
            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);

            return res.status(response_body.status).json(response_body)
        }

        logger.error("Error creating user")

        if (error instanceof UserValidationError) {
            logger.error(error.name)

            response_body.status = 400
            response_body.message = error.message
            response_body.errors = error.cause as object

        } else if (error instanceof UserEmailAlreadyBeingUsedError) {
            logger.error(error.name)

            response_body.status = 400
            response_body.message = error.message
            response_body.errors = {email: "E-mail em uso"}

        } else if (error instanceof RoleNotFoundError) {
            logger.error(error.name)

            response_body.status = 400
            response_body.message = error.message
            response_body.errors = {role: "Cargo não encontrado"}
        } else {
            logger.error("Internal Server Error")
            logger.error(error)

            response_body.status = 500
            response_body.message = "Erro Interno do servidor"
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
        return res.status(response_body.status).json(response_body)
    }

    getById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Detalhes do usuario"
        }

        const {user_id} = req.params

        const get_user_by_id = new GetUserByIdUseCase(this.user_repository)

        logger.info("Trying to get user")
        const {error, user} = await get_user_by_id.execute(user_id)

        if (user) {
            logger.info("User got successfully")
            response_body.data = {user}

            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
            return res.status(response_body.status).json(response_body)
        }

        logger.error("Error getting user")

        if (error instanceof UserNotFoundError) {
            logger.error(error.name);

            response_body.status = 404
            response_body.message = "Usuario não encontrado"
            response_body.errors = {user: "Usuario não encontrado"}

        } else {
            logger.error("Internal Server Error")
            logger.error(error)

            response_body.status = 500
            response_body.message = "Erro Interno do servidor"
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
        return res.status(response_body.status).json(response_body)
    }

    updateById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Usuario atualizado com sucesso"
        }

        const {user_id} = req.params

        const role_repository = new RoleRepositoryPostgres()

        const update_user = new UpdateUserByIdUseCase(
            this.user_repository,
            role_repository
        )

        logger.info("Trying to update user")
        const {error, isUpdated} = await update_user.execute(user_id, req.body)

        if (isUpdated) {
            logger.info("User updated successfully")
            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);

            return res.status(response_body.status).json(response_body)
        }

        logger.error("Error updating user")

        if (error instanceof UserNotFoundError) {
            logger.error(error.name);

            response_body.status = 404
            response_body.message = "Usuario não encontrado"
            response_body.errors = {user: "Usuario não encontrado"}

        } else if (error instanceof UserValidationError) {
            logger.error(error.name);

            response_body.status = 400
            response_body.message = error.message
            response_body.errors = error.cause as object

        } else if (error instanceof RoleNotFoundError) {
            logger.error(error.name);

            response_body.status = 404
            response_body.message = "Cargo não encontrado"
            response_body.errors = {role: "Cargo não encontrado"}

        } else if (error instanceof UserEmailAlreadyBeingUsedError) {
            logger.error(error.name);

            response_body.status = 400
            response_body.message = "E-mail de Usuario em uso"
            response_body.errors = {email: "E-mail em uso"}

        } else {
            logger.error("Internal Server Error")
            logger.error(error)

            response_body.status = 500
            response_body.message = "Erro Interno do Servidor"
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
        return res.status(response_body.status).json(response_body)
    }

    deleteById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Usuario apagado com sucesso"
        }

        const {user_id} = req.params

        logger.info("Trying to delete the user")
        const delete_user = new DeleteUserByIdUseCase(this.user_repository)

        const {error, isDeleted} = await delete_user.execute(user_id)

        if (isDeleted) {
            logger.info("User deleted successfully")
            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);

            return res.status(response_body.status).json(response_body)
        }

        logger.error("Error deleting user")

        if (error instanceof UserNotFoundError) {
            logger.error(error.name);

            response_body.status = 404
            response_body.message = "Usuario não encontrado"
            response_body.errors = {user: "Usuario não encontrado"}

        } else {
            logger.error("Internal Server Error")
            logger.error(error)

            response_body.status = 500
            response_body.message = "Erro Interno do Servidor"
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
        return res.status(response_body.status).json(response_body)
    }
}
