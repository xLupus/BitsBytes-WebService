import { env } from "./env";
import { app } from "./http/server";

const { APP_PORT } = env

app.listen(APP_PORT, () => console.log(`Server running on http://localhost:${APP_PORT}`))
