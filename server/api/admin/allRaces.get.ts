import { Err, Ok } from "~~/shared/api_response"
import type { DatabaseRaceType } from "~~/shared/DatabaseRaceType"
import { validateSessionAsAdmin } from "./validateSession"

export default defineEventHandler(async (event) => {
    if (!validateSessionAsAdmin(event))
        return Err(400, "Admin Only API call")

    try  {
        console.log("iwehagruipgbauseip;rgbuijklesdbgiu;juadssug;ijkadfi;ujk")
        const db = event.context.cloudflare.env.race_and_times
       
        console.log("swbdiufohljusdglih;juadssug;ijkadfi;ujk")
        const { results } = await db
            .prepare("SELECT * FROM Races")
            .all()

        console.log("thgj89023w4890h3e809ig0bv")

        return Ok(results as DatabaseRaceType[])
    } catch (error) {
        console.error(error)
        return Err(500, "Failed to load races database")
    }
})