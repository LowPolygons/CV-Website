import { readFile } from "node:fs/promises"
import { Err, Ok, type ApiResponse } from "~~/shared/api_response"
import { join } from "node:path"
import type { TimesFormat } from "~~/shared/api_return_type"

export default defineEventHandler(async (event) => {

    const query = getQuery(event)

    if (typeof query.race !== "string") {
        return Err(400, "Expected a race parameter")
    }

    const desiredRace = query.race.trim() as string

    try {
        const times: Array<TimesFormat> = await readFile(
            join(process.cwd(), "app/data/times.json"), "utf8")
            .then((data: string) => {
                if (data === "") data = "[]"

                return JSON.parse(data)
            })                

        console.log(times)

        const filtered = times.filter((element) => {
            return (element.raceName.toLowerCase() === desiredRace.toLowerCase())
        })

        return Ok(filtered)

    } catch (error) {
        console.error("Error reading files server side: ", error)
        return Err(500, "Failed to load times") 
    }
})