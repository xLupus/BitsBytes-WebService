// * Erro da Aplicação contendo mensagem, status_code, details: any
// TODO: Estudar Erros Hibridos
// TODO: Middleware de Erro
// TODO: Unexpected Error Occured

export class UserNotFoundError extends Error {
    constructor() {
        super()
        this.name = "UserNotFoundError"
    }
}

export class UserValidationError extends Error {
    constructor(cause: object, message = "Valores de Input de Usuario Invalidos") {
        super()
        this.message = message
        this.cause = cause
        this.name = "UserValidationError"
    }
}
