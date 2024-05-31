// * Erro da Aplicação contendo mensagem, status_code, details: any
// TODO: Estudar Erros Hibridos
// TODO: Middleware de Erro
// TODO: Unexpected Error Occured

export class RoleNotFoundError extends Error {
    constructor() {
        super()
        this.name = "RoleNotFoundError"
    }
}

export class RoleValidationError extends Error {
    constructor(cause: object, message = "Valores de input de cargo invalidos") {
        super()
        this.message = message
        this.cause = cause
        this.name = "RoleValidationError"
    }
}

export class RoleNameAlreadyBeingUsedError extends Error {
    constructor() {
        super()
        this.name = "RoleNameAlreadyBeingUsedError"
    }
}