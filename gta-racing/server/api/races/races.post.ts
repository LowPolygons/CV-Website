import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, format, join } from "node:path"
import { C } from "vue-router/dist/index-BQLwgiyK.js"
import { Err, Ok } from "~~/shared/api_response"
import { RaceType } from "~~/shared/RaceType"

export default defineEventHandler(async (event) => {
    type ImageOrPlaceholderType = string | {
            filename: string
            type: string
            data: Buffer
        }
    type RaceDetailsPreApproved = { 
        name: string 
        description: string 
        imageOrPlaceholder: ImageOrPlaceholderType 
    }

    try {
        const newRaceParts = await readMultipartFormData(event)

        console.log(newRaceParts)

        if (!newRaceParts) return Err(401, "Unable to read multipart form data")

        const getValue = (key: string) => newRaceParts.find(part => part.name === key)

        const raceName = getValue("name")!.data.toString()
        console.log(raceName)

        const raceDescription = getValue("description")!.data.toString()
        console.log(raceDescription)

        const raceImageData: ImageOrPlaceholderType = 
            (getValue("placeholderImage")) ? 
                getValue("placeholderImage")!.data.toString() :
                {
                    filename: getValue("image")!.filename!,
                    type: getValue("image")!.type!,
                    data: getValue("image")!.data
                }
        console.log(raceImageData)


        const pathIfFileIsntPlaceholder = "/uploads/" + raceName + "/"

        const formattedImageURL = (typeof(raceImageData) === "string") ?
                raceImageData : pathIfFileIsntPlaceholder + raceImageData.filename
        const fileSystemImageUrl = join(process.cwd(), "uploads", formattedImageURL)

        const existingRaces: Array<RaceType> = await readFile(
            join(process.cwd(), "/server/data/races.json"), "utf8")
            .then((data: string) => JSON.parse(data));
        

        // Write the new image to the public assets
        if (typeof(raceImageData) !== "string") {
            await mkdir(dirname(fileSystemImageUrl), { recursive: true })
            await writeFile(fileSystemImageUrl, raceImageData.data)
        }

        existingRaces.push({
            name: raceName,
            description: raceDescription,
            imageUrl: formattedImageURL,
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