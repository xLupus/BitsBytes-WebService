const { randomUUID } = require("node:crypto");
const { PrismaClient } = require("@prisma/client")
const { execSync } = require('node:child_process')
const { resolve } = require('node:path')
const NodeEnvironment = require('jest-environment-node').TestEnvironment;

require("dotenv").config({
    path: resolve(__dirname, '..', '..', '..', '.env.test'),
    override: true
})

const prisma_cli = ".\\node_modules\\prisma"

class CustomEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config)
        
        this.schema = `test_${randomUUID().toString()}`
        this.connectionString = `${process.env.DATABASE_URL}${this.schema}`
    }

    async setup() {
        process.env.DATABASE_URL = this.connectionString
        this.global.process.env.DATABASE_URL = this.connectionString

        execSync(`npx ${prisma_cli} migrate dev`)
    }

    async teardown() {
        const client = new PrismaClient({ datasourceUrl: this.connectionString })

        await client.$connect()
        await client.$executeRaw(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
        await client.$disconnect()
    }
}

module.exports = CustomEnvironment