import {Request, Response} from 'express';
import {GetAllCategoriesUseCase} from "../../../../use_cases/category_usecase/read/get_all_categories";
import {HttpResponseFormat} from "../../../../types/types";
import {CategoryRepositoryPostgres} from "../../../../repositories/postgres/category_repository";
import {logger} from "../../../../config/logging";
import {CategoryInput} from "../../../../types/category";
import {CreateCategoryUseCase} from "../../../../use_cases/category_usecase/create/create_category";
import {
    CategoryNameAlreadyBeingUsedError,
    CategoryNotFoundError,
    CategoryValidationError
} from "../../../exceptions/category_expections";
import {GetCategoryByIdUseCase} from "../../../../use_cases/category_usecase/read/get_by_id";
import {UpdateCategoryByIdUseCase} from "../../../../use_cases/category_usecase/update/update_category_by_id";
import {DeleteCategoryByIdUseCase} from "../../../../use_cases/category_usecase/delete/delete_category_by_id";

export class CategoryController {
    create = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 201,
            message: "Cargo criado com sucesso"
        }

        const category_input: CategoryInput = req.body;

        const category_repository = new CategoryRepositoryPostgres();
        const create_category_usecase = new CreateCategoryUseCase(category_repository);

        logger.info("Trying to create a new category")
        const {error, isCreated} = await create_category_usecase.execute(category_input);

        if (isCreated) {
            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error creating category`);

            if (error instanceof CategoryNameAlreadyBeingUsedError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = "Categoria já existe";
            } else if (error instanceof CategoryValidationError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = error.message;
                response_body.errors = error.cause as object;
            } else {
                logger.error(error);

                response_body.status = 500;
                response_body.message = "Erro interno do Servidor";
            }
        }

        return res.status(response_body.status).json(response_body);
    }

    getAll = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Lista de Categorias"
        }

        logger.info("Trying to list categories")
        const get_all_category_usecase = new GetAllCategoriesUseCase(new CategoryRepositoryPostgres())

        const {error, categories} = await get_all_category_usecase.execute()

        if (categories) {
            logger.info("Categories listed successfully")
            response_body.data = {categories}

            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error("Error listing categories")
            logger.error(`Internal Server Error ${error}`)

            response_body.status = 500
            response_body.message = "Erro Interno do Servidor"
        }


        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`)
        return res.status(response_body.status).json(response_body);
    };

    getById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const {category_id} = req.params

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Detalhes da Categoria"
        }

        const category_repository = new CategoryRepositoryPostgres();
        const get_category_by_id_usecase = new GetCategoryByIdUseCase(category_repository)

        logger.info("trying to get the category")
        const {error, category} = await get_category_by_id_usecase.execute(category_id);

        if (category) {
            logger.info("Category got successfully")
            response_body.data = {category}

            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request FInished`);
            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error("Error getting category")

            if (error instanceof CategoryNotFoundError) {
                logger.error(error.name);

                response_body.status = 404;
                response_body.message = error.message;
            } else {
                logger.error("Internal Server Error");

                response_body.status = 500;
                response_body.message = "Erro Interno do Servidor";
            }
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request FInished`);
        return res.status(response_body.status).json(response_body);
    }

    updateById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const {category_id} = req.params

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Categoria atualizada",
        }

        const category_repository = new CategoryRepositoryPostgres();
        const update_category_by_id = new UpdateCategoryByIdUseCase(category_repository)

        logger.info("Trying to update the category")
        const {error, isUpdated} = await update_category_by_id.execute(category_id, req.body);

        if (isUpdated) {
            logger.info("Category updated successfully")
            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);

            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error updating the category`)

            if (error instanceof CategoryNotFoundError) {
                logger.error(error.name);

                response_body.status = 404;
                response_body.message = error.message;
            } else if (error instanceof CategoryValidationError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = error.message;
                response_body.errors = error.cause as object;
            } else if (error instanceof CategoryNameAlreadyBeingUsedError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = "Categoria já criada";
                response_body.errors = {
                    name: "Categoria já criada"
                }
            } else {
                logger.error(`Internal Server Error ${error.toString()}`);

                response_body.status = 500;
                response_body.message = "Erro Interno do Servidor";
            }
        }

        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);
        return res.status(response_body.status).json(response_body);
    }

    deleteById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl}`;
        logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Started`);

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Categoria apagada",
        }

        const {category_id} = req.params

        const category_repository = new CategoryRepositoryPostgres();
        const delete_category_by_id = new DeleteCategoryByIdUseCase(category_repository)

        logger.info(`Trying to delete the category`)
        const {error, isDeleted} = await delete_category_by_id.execute(category_id);

        if (isDeleted) {
            logger.info(`Category deleted successfully`)
            logger.info(`${request_path} ${req.protocol}/${req.httpVersion} - Request Finished`);

            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error updating the category`)

            if (error instanceof CategoryNotFoundError) {
                logger.error(error.name);

                response_body.status = 404;
                response_body.message = error.message;
            } else {
                logger.error(`Internal Server Error ${error.toString()}`);

                response_body.status = 500;
                response_body.message = "Erro Interno do Servidor";
            }
        }

        return res.status(response_body.status).json(response_body);
    }
}