import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Err, Ok } from "~~/shared/api_response"
import { RaceType } from "~~/shared/RaceType"
import { StoredTimeData } from "~~/shared/StoredTimeData"

export default defineEventHandler(async () => {
    try  {
        const races: Array<RaceType> = await readFile(
            join(process.cwd(), "/server/data/races.json"), "utf8")
            .then((data: string) => JSON.parse(data));
        
        return Ok(races.filter((race) => {
            return race.approved
        }))
    } catch (error) {
        console.error(error)
        return Err(500, "Failed to load races database")
    }
})