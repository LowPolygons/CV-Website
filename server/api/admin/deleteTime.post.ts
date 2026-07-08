import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return createError({
            status: 400, 
            message: "Admin Only API call"
        })

    type FormatOfTargetTime = {
        timeId: number
    }
    try {
        const body = await readBody(event) as FormatOfTargetTime

        const db = event.context.cloudflare.env.race_and_times
       
        await db
            .prepare(`DELETE FROM Times WHERE time_id = ?`)
            .bind(body.timeId)
            .run()

        return body
    } catch (error) {
        return createError({
            status: 500, 
            message: "Failed to authenticate a deletion"
        }) 
    }
})