import DailyRotateFile from "winston-daily-rotate-file";
import { createLogger, transports, format } from "winston";
import { resolve } from "node:path";

const { combine, cli, timestamp, metadata, printf } = format;

const my_format = printf(info => {
    const { level, message, meta } = info;
    const { timestamp } = meta;

    return `${timestamp} - ${String(level).toUpperCase()} - ${message}`;
});

export const logger = createLogger({
    transports: [
        new transports.Console({ level: "debug", format: cli() }),

        new DailyRotateFile({
            level: "http",
            dirname: resolve(
                __dirname, '..', '..', 'logs',
                new Date().toLocaleString("pt-BR", { year: "numeric" }),
                new Date().toLocaleString("pt-BR", { month: "long" })
            ),
            datePattern: "DD-MM-YYYY",
            filename: "%DATE%",
            extension: ".log",
            format: combine(
                timestamp({ format: "DD/MM/YYYY hh:mm:ss" }),
                metadata({ key: "meta" }),
                my_format
            ),
        }),
    ],
});