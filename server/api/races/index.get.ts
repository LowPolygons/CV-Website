import { RaceType } from "~~/shared/RaceType"
import type { DatabaseRaceType } from "~~/shared/DatabaseRaceType"

export default defineEventHandler(async (event) => {
    try  {
        const db = event.context.cloudflare.env.race_and_times
       
        const { results } = await db
            .prepare("SELECT * FROM Races")
            .all()

        const races: Array<RaceType> = (results as DatabaseRaceType[]).map((race) => ({
            name: race.name,
            description: race.description,
            approved: Boolean(race.approved),
            imageUrl: race.image_url,
            id: race.race_id
        }))

        return races.filter((race) => {
            return race.approved
        })
    } catch (error) {
        console.error(error)
        throw createError({
            status: 501,
            message: "Failed to load races database"
        })
    }
})