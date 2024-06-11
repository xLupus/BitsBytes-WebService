import "dotenv/config";
import express from "express";
import api_v1_routes from "../http/routes/api/v1";
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1', api_v1_routes)
    
export {app}