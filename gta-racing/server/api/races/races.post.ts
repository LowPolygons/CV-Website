import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { Err, Ok } from "~~/shared/api_response"
import { RaceType } from "~~/shared/RaceType"

export default defineEventHandler(async (event) => {
    type RaceDetailsPreApproved = {
        name: string
        description: string
        imageUrl: string
    }

    try {
        const newRace = await readBody(event) as RaceDetailsPreApproved 

        const existingRaces: Array<RaceType> = await readFile(
            join(process.cwd(), "/server/data/races.json"), "utf8")
            .then((data: string) => JSON.parse(data));

        existingRaces.push({
            name: newRace.name,
            description: newRace.description,
            imageUrl: newRace.imageUrl,
            approved: false
        })

        await writeFile(
            join(process.cwd(), "/server/data/races.json"), 
            JSON.stringify(existingRaces, null, 2)
        )

        return Ok(true)
    } catch (error) {
        return Err(500, "Failed to load races database")
    }
})