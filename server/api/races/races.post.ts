import { randomInt } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { Err, Ok } from "~~/shared/api_response"
import { RaceType } from "~~/shared/RaceType"

function generateMockUUID(): string {
    const validChars = "1234567890abcdef"
    let result = ""
    for (let i = 0; i < 32; i++) {
        result = result + validChars.at(randomInt(validChars.length - 1))
    }
    return result
}

export default defineEventHandler(async (event) => {
    type ImageOrPlaceholderType = string | {
            filename: string
            type: string
            data: Buffer
        }

    try {
        const newRaceParts = await readMultipartFormData(event)

        console.log(newRaceParts)

        if (!newRaceParts) return Err(401, "Unable to read multipart form data")

        const getValue = (key: string) => newRaceParts.find(part => part.name === key)

        const raceName = getValue("name")!.data.toString()
        const raceDescription = getValue("description")!.data.toString()
        const raceImageData: ImageOrPlaceholderType = 
            (getValue("placeholderImage")) ? 
                getValue("placeholderImage")!.data.toString() :
                {
                    filename: getValue("image")!.filename!,
                    type: getValue("image")!.type!,
                    data: getValue("image")!.data
                }

        const pathIfFileIsntPlaceholder = "/uploads/" + generateMockUUID() + "/"

        const formattedImageURL = (typeof(raceImageData) === "string") ?
                raceImageData : pathIfFileIsntPlaceholder + raceImageData.filename
        const fileSystemImageUrl = join(process.cwd(), "public", formattedImageURL)

        // Calculate the current highest id
        let highestId = 0;

        // Write the new image to the public assets
        if (typeof(raceImageData) !== "string") {
            await mkdir(dirname(fileSystemImageUrl), { recursive: true })
            await writeFile(fileSystemImageUrl, raceImageData.data)
        }

        const db = event.context.cloudflare.env.race_and_times

        await db.prepare(`INSERT INTO Races
            (name, description, approved, image_url) 
            VALUES (?, ?, ?, ?)`)
            .bind(raceName, raceDescription, 0, formattedImageURL)
            .run()

        return Ok(true)
    } catch (error) {
        console.error(error)
        return Err(500, "Failed to load races database")
    }
})
