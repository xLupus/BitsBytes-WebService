import { Request, Response } from "express";
import { HttpResponseFormat } from "../../../../types/types";
import {  TagInput } from "../../../../types/tag";
import { TagRepositoryPostgres } from "../../../../repositories/postgres/tag_repository";
import { CreateTagUseCase } from "../../../../use_cases/tag_usecase/create/create_tag";
import { GetAllTagsUseCase } from "../../../../use_cases/tag_usecase/read/get_all_tags";
import { GetTagByIdUseCase } from "../../../../use_cases/tag_usecase/read/get_tag_by_id";
import { TagNameAlreadyBeingUsedError, TagNotFoundError, TagValidationError } from "../../../exceptions/tag_exceptions";
import { UpdateTagByIdUseCase } from "../../../../use_cases/tag_usecase/update/update_tag_by_id";
import { DeleteTagByIdUseCase } from "../../../../use_cases/tag_usecase/delete/delete_tag_by_id";
import { logger } from "../../../../config/logging";

export class TagController {
    getAll = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`,);

        const response_body: HttpResponseFormat = { status: 200, message: "Lista de cargos" };

        const tagRepository = new TagRepositoryPostgres();
        const get_all_tags = new GetAllTagsUseCase(tagRepository);

        logger.info("Trying to get tags");
        const { error, tags } = await get_all_tags.execute();

        if (error) { // TODO: Arrumar a resposta de Erros
            logger.error("Failed to get tags " + error);

            response_body.status = 500;
            response_body.message = "Erro Interno";
        }

        logger.info("Tags got successfully");
        response_body.data = { tags };

        logger.info(`${request_path} - Request finished`);
        return res.status(response_body.status).json(response_body);
    };

    getById = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const response_body: HttpResponseFormat = { status: 200, message: "Detalhes de Cargo" };
        const { tag_id } = req.params;

        const tag_repository = new TagRepositoryPostgres();
        const get_tag_by_id = new GetTagByIdUseCase(tag_repository);

        logger.info("Trying to get the tag details");
        const { error, tag } = await get_tag_by_id.execute(tag_id);

        if (error) {
            if (error instanceof TagNotFoundError) {
                logger.error(`Tag not found`);

                response_body.status = 404;
                response_body.message = "Cargo não encontrado";
            } else {
                logger.error(`Internal Error`);

                response_body.status = 500;
                response_body.message = "Erro Interno";
            }

            return res.status(response_body.status).json(response_body);
        }

        logger.info("Tags got successfully");
        logger.info(`${request_path} - Request finished`);

        response_body.data = { tag };

        return res.status(response_body.status).json(response_body);
    };

    create = async (req: Request, res: Response) => {
        const request_path = `${req.method} ${req.originalUrl} ${req.protocol}/${req.httpVersion}`;
        logger.info(`${request_path} - Request started`);

        const response_body: HttpResponseFormat = {
            status: 201,
            message: "Cargo criado com sucesso"
        };

        const tagInput: TagInput = req.body;

        const tag_repository = new TagRepositoryPostgres();
        const create_tag = new CreateTagUseCase(tag_repository);

        logger.info(`Trying to create a tag`);
        const { error, isCreated } = await create_tag.execute(tagInput);

        if (isCreated) {
            logger.info("Tags create successfully");
            logger.info(`${request_path} - Request finished`);
            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error creating a tag`);

            if (error instanceof TagValidationError) {
                logger.error(error.name);

                response_body.status = 400;
                response_body.message = "Valor invalidos";
                response_body.errors = error.cause as object;
            } else if (error instanceof TagNameAlreadyBeingUsedError) {
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

        const { tag_id } = req.params;

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Cargo Atualizado com sucesso"
        };

        const tag_repository = new TagRepositoryPostgres();
        const update_tag_by_id = new UpdateTagByIdUseCase(tag_repository);

        logger.info(`Trying to update the tag`);
        const { error, isUpdated } = await update_tag_by_id.execute(tag_id, req.body);

        if (isUpdated) {
            logger.info(`Tag updated succefully`);
            logger.info(`${request_path} - Request finished`);

            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error updating the tag`);

            if (error instanceof TagNotFoundError) {
                logger.error(error.name);
                response_body.status = 404;
                response_body.message = "Cargo não encontrado";
            } else if (error instanceof TagValidationError) {
                logger.error(error.name);
                response_body.status = 400;
                response_body.message = "Cargo não encontrado";
                response_body.errors = error.cause as object;
            } else if (error instanceof TagNameAlreadyBeingUsedError) {
                logger.error(error.name);
                response_body.status = 400;
                response_body.message = "O nome de cargo já está sendo utilizado";
                response_body.errors = {
                    name: "O nome de cargo já está sendo utilizado"
                }
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

        const { tag_id } = req.params;

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Cargo Apagado com sucesso"
        };

        const tag_repository = new TagRepositoryPostgres();
        const delete_tag_by_id = new DeleteTagByIdUseCase(tag_repository);

        logger.info(`Trying to delete the tag`);
        const { error, isDeleted } = await delete_tag_by_id.execute(tag_id);

        if (isDeleted) {
            logger.info(`Tag deleted succefully`);
            logger.info(`${request_path} - Request finished`);
            return res.status(response_body.status).json(response_body);
        }

        if (error) {
            logger.error(`Error updating the tag`);

            if (error instanceof TagNotFoundError) {
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