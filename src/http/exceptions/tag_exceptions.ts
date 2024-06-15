// * Erro da Aplicação contendo mensagem, status_code, details: any
// TODO: Estudar Erros Hibridos
// TODO: Middleware de Erro
// TODO: Unexpected Error Occured

export class TagNotFoundError extends Error {
    constructor() {
        super()
        this.name = "TagNotFoundError"
    }
}

export class TagValidationError extends Error {
    constructor(cause: object, message = "Valores de input de tag invalidos") {
        super()
        this.message = message
        this.cause = cause
        this.name = "TagValidationError"
    }
}

export class TagNameAlreadyBeingUsedError extends Error {
    constructor() {
        super()
        this.name = "TagNameAlreadyBeingUsedError"
    }
}