import { Request, Response } from "express"
import { UserRepositoryPostgres } from "../../../../repositories/postgres/user_repository"
import { HttpResponseFormat } from "../../../../types/types"
import { UserValidationError } from "../../../esceptions/user-exceptions"
import { CreateUserUseCase } from "../../../../use_cases/user_usecase/create_user"
import { UserInput } from "../../../../types/user"

export class UserController {
    create = async (req: Request, res: Response) => {
        const response_body: HttpResponseFormat = {
            status: 201,
            message: "Usuario Criado com Sucesso"
        }

        const userInput: UserInput = req.body

        const userRepository = new UserRepositoryPostgres()
        const create_user_usecase = new CreateUserUseCase(userRepository)

        const [error, isCreated] = await create_user_usecase.execute(userInput)

        if (isCreated)
            return res.status(response_body.status).json(response_body)

        if (error) {
            if (error instanceof UserValidationError) {
                response_body.status = 400
                response_body.message = "Não foi possivel criar o usuario, verifique os valores dos campos."
                response_body.errors = error.cause as object
            }

            // TODO: Criar as Verificações de Erro

            return res.status(response_body.status).json(response_body)
        }
    }
}