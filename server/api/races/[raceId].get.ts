import { getRouterParam } from 'h3'
import { RaceType } from "~~/shared/RaceType"
import { DatabaseRaceType } from "~~/shared/DatabaseRaceType"

export default defineEventHandler(async (event) => {
    try {
        const desiredRace = Number(getRouterParam(event, "raceId"))

        const db = event.context.cloudflare.env.race_and_times
        
        const { results } = await db
            .prepare("SELECT * FROM Races WHERE race_id = ?")
            .bind(desiredRace)
            .all()

        const filteredRace: Array<RaceType> = (results as DatabaseRaceType[])
            .map((race) => ({
                name: race.name,
                description: race.description,
                approved: Boolean(race.approved),
                imageUrl: race.image_url,
                id: race.race_id
            }))

        if (filteredRace.length === 0) 
            throw createError({
                status: 405, 
                message: "The Provided race ID does not exist in the database"
            })
        if (filteredRace.length !== 1) 
            throw createError({
                status: 501, 
                message: "Server side error: multiple races have an identical ID"
            })

        return filteredRace[0]
    } catch (error) {
        console.error("Error reading files server side: ", error)
        throw createError({
            status: 500,
            message: "Failed to load times"
        })
    }
})