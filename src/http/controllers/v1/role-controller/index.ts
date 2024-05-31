import { Request, Response } from "express";
import { HttpResponseFormat } from "../../../../types/types";
import { RoleGetAllOptions, RoleInput, RoleOutput } from "../../../../types/role";
import { RoleRepositoryPostgres } from "../../../../repositories/postgres/role_repository";
import { CreateRoleUseCase } from "../../../../use_cases/role_usecase/create_role";
import { GetAllRolesUseCase } from "../../../../use_cases/role_usecase/get_all_roles";
import { GetRoleByIdUseCase } from "../../../../use_cases/role_usecase/get_role_by_id";
import { RoleNotFoundError } from "../../../esceptions/role-exceptions";
import { UpdateRoleByIdUseCase } from "../../../../use_cases/role_usecase/update_role_by_id";
import { DeleteRoleByIdUseCase } from "../../../../use_cases/role_usecase/delete_role_by_id";

export class RoleController {
    getAll = async (req: Request, res: Response) => {
        const response_body: HttpResponseFormat = { status: 200, message: "Lista de cargos" }
        const get_all_roles_options: RoleGetAllOptions = {}
        const { filter, order, skip, take } = req.query

        if (filter) {
            const [filterColumn, filterValue] = filter.toString().split(":")

            if (filterColumn == "name")
                get_all_roles_options.filter = { column: "name", value: filterValue }
        }

        if (order) {
            const order_column = order.toString().substring(1)
            const order_operator = order.toString()[0]

            if (order_column == "name")
                get_all_roles_options.order = { column: "name", order_operator: order_operator == '-' ? 'desc' : 'asc' }
        }

        if (!isNaN(Number(skip)))
            get_all_roles_options.paginate = { skip: Number(skip) }

        if (!isNaN(Number(take)))
            get_all_roles_options.paginate = { ...get_all_roles_options.paginate, take: Number(take) }

        const roleRepository = new RoleRepositoryPostgres()
        const get_all_roles_usecase = new GetAllRolesUseCase(roleRepository)

        const [error, roles] = await get_all_roles_usecase.execute(get_all_roles_options)

        if (error) { // TODO: Arrumar a resposta de Erros
            return res.json(error)
        }

        response_body.data = {
            roles: roles as Array<RoleOutput> // TODO - Converter o dado para o formato de Output
        }

        return res.status(response_body.status).json(response_body)
    }

    getById = async (req: Request, res: Response) => {
        const response_body: HttpResponseFormat = { status: 200, message: "Detalhes de Cargo" }
        const { role_id } = req.params

        const role_repository = new RoleRepositoryPostgres()
        const get_role_by_id_usecase = new GetRoleByIdUseCase(role_repository)

        const [error, role] = await get_role_by_id_usecase.execute(role_id)

        if (error) {
            if (error instanceof RoleNotFoundError) {
                response_body.status = 404
                response_body.message = "Cargo não encontrado"
            } else {
                console.log(error)
                response_body.status = 500
                response_body.message = "Erro Interno"
            }

            return res.status(response_body.status).json(response_body)
        }

        response_body.data = { role }

        return res.status(response_body.status).json(response_body)
    }

    create = async (req: Request, res: Response) => {
        const response_body: HttpResponseFormat = {
            status: 201,
            message: "Cargo criado com sucesso"
        }

        const roleInput: RoleInput = req.body

        const role_repository = new RoleRepositoryPostgres()
        const create_role_usecase = new CreateRoleUseCase(role_repository)

        const [error, isCreated] = await create_role_usecase.execute(roleInput)

        if (isCreated)
            return res.status(response_body.status).json(response_body)

        if (error) {
            res.json(error)
        }
    }

    updateById = async (req: Request, res: Response) => {
        const { role_id } = req.params

        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Cargo Atualizado com sucesso"
        }

        const role_repository = new RoleRepositoryPostgres()
        const update_role_by_id_usecase = new UpdateRoleByIdUseCase(role_repository)

        const [error, isUpdated] = await update_role_by_id_usecase.execute(role_id, req.body)

        if (isUpdated)
            return res.status(response_body.status).json(response_body)

        if (error) {
            if (error instanceof RoleNotFoundError) {
                response_body.status = 404
                response_body.message = "Cargo não encontrado"
            } else {
                response_body.status = 500
                response_body.message = "Internal Server Error"
                response_body.errors = error as object
            }
        }

        return res.status(response_body.status).json(response_body)
    }

    deleteById = async (req: Request, res: Response) => {
        const { role_id } = req.params
        
        const response_body: HttpResponseFormat = {
            status: 200,
            message: "Cargo Apagado com sucesso"
        }

        const role_repository = new RoleRepositoryPostgres()
        const delete_role_by_id_usecase = new DeleteRoleByIdUseCase(role_repository)

        const [error, isDeleted] = await delete_role_by_id_usecase.execute(role_id)

        if (isDeleted)
            return res.status(response_body.status).json(response_body)
        
        if(error) {
            response_body.status = 400
        }

        return res.status(response_body.status).json(response_body)
    }
}