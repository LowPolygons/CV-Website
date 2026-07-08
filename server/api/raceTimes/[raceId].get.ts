import { getRouterParam } from 'h3'
import type { StoredTimeData } from "~~/shared/StoredTimeData"
import type { DatabaseTimeData } from "~~/shared/DatabaseTimeData"

export default defineEventHandler(async (event) => {
    try {
        const db = event.context.cloudflare.env.race_and_times

        const desiredRace = Number(getRouterParam(event, "raceId"))

        if (desiredRace === undefined)
            throw createError({
                status: 400, 
                message: "Improper API request, raceId router param undefined"
            })

        const { results } = await db
            .prepare("SELECT * FROM Times WHERE race_id = ?")
            .bind(desiredRace)
            .all()

        const times: Array<StoredTimeData> = ( results as DatabaseTimeData[])
            .map((time) => ({
                raceId: time.race_id,
                username: time.username,
                car: time.car,
                mins: time.mins,
                secs: time.secs,
                millis: time.millis
            }))

        const filtered = times.filter((element) => {
            return (element.raceId) ? (element.raceId === desiredRace) : false
        })

        return filtered

    } catch (error) {
        console.error("Error reading files server side: ", error)
        throw createError({
            status: 500, 
            message: "Failed to load times"
        }) 
    }
})