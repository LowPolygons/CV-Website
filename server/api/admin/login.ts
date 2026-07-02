import { Err, Ok } from "~~/shared/api_response"

export default defineEventHandler(async (event) => {
    type FormatOfLogin = {
        username: string,
        password: string
    }

    try {
        const env = event.context.cloudflare.env 
        // const env = process.env
        const body = await readBody(event) as FormatOfLogin

        if (
            body.username === env.ADMIN_USERNAME &&
            body.password === env.ADMIN_PASSWORD
        ) {
            setCookie(event, "admin_session", "enabled", {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                path: "/"
            })

            return Ok(true)
        }
        return Err(400, "Logged in with wrong credentials")
    } catch (error) {
        return Err(500, "Failed to authenticate user login") 
    }
})