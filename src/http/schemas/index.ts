import z from "zod";

export const schema_errors_messages = {
    invalid_type: {
        string: "O valor do campo deve ser um texto",
        boolean: "O valor do campo deve ser TRUE ou False",
    },

    format: {
        uuid: "Formato de UUID invalido",
        email: "Formato de E-mail invalido",
    },

    length: {
        password: "A senha deve ter no minimo 8 caracteres",
        min_1: "Preencha esse campo",
        max: "Quantidade máxima de caracteres excedida",
    },

    required_field: "Chave ausente no JSON",
}


export const uuid_schema = z
    .string({
        invalid_type_error: schema_errors_messages.invalid_type.string,
        required_error: schema_errors_messages.required_field
    })
    .uuid(schema_errors_messages.format.uuid)


export const active_schema = z
    .boolean({
        invalid_type_error: schema_errors_messages.invalid_type.boolean,
        required_error: schema_errors_messages.required_field
    })


export const name_schema = z
    .string({
        invalid_type_error: schema_errors_messages.invalid_type.string,
        required_error: schema_errors_messages.required_field
    })
    .min(1, schema_errors_messages.length.min_1)


export const description_schema = z
    .string({
        invalid_type_error: schema_errors_messages.invalid_type.string,
        required_error: schema_errors_messages.required_field
    })
    .min(1, schema_errors_messages.length.min_1)


export const email_schema = z
    .string({
        invalid_type_error: schema_errors_messages.invalid_type.string,
        required_error: schema_errors_messages.required_field
    })
    .min(1, schema_errors_messages.length.min_1)
    .email(schema_errors_messages.format.email)

export const password_schema = z
    .string({
        invalid_type_error: schema_errors_messages.invalid_type.string,
        required_error: schema_errors_messages.required_field
    })
    .min(1, schema_errors_messages.length.min_1)
