export class CategoryNotFoundError extends Error {
    constructor() {
        super()
        this.name = "CategoryNotFoundError"
    }
}

export class CategoryValidationError extends Error {
    constructor(cause: object, message = "Valores de input de categoria invalidos") {
        super()
        this.message = message
        this.cause = cause
        this.name = "CategoryValidationError"
    }
}

export class CategoryNameAlreadyBeingUsedError extends Error {
    constructor() {
        super()
        this.name = "CategoryNameAlreadyBeingUsedError"
    }
}