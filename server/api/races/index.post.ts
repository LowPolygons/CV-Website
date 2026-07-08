import { randomInt } from "node:crypto"

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

        if (!newRaceParts) return createError({
            status: 401, 
            message: "Unable to read multipart form data"
        })

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

        const pathIfFileIsntPlaceholder = "uploads/" + generateMockUUID() + "/"

        const formattedImageURL = (typeof(raceImageData) === "string") ?
                raceImageData : pathIfFileIsntPlaceholder + raceImageData.filename

        // Write the new image to the public assets
        if (typeof(raceImageData) !== "string") {
            await event.context.cloudflare.env.IMAGES.put(
                formattedImageURL,
                raceImageData.data,
                {
                    httpMetadata: {
                        contentType: raceImageData.type
                    }
                }
            )
            const maybe_success = await event.context.cloudflare.env.IMAGES.get(formattedImageURL)

            if (maybe_success === null)
                return createError({
                    status: 505, 
                    message: "Could not upload provided image to server"
                })
        }

        const db = event.context.cloudflare.env.race_and_times

        await db.prepare(`INSERT INTO Races
            (name, description, approved, image_url) 
            VALUES (?, ?, ?, ?)`)
            .bind(raceName, raceDescription, 0, formattedImageURL)
            .run()

        return true
    } catch (error) {
        console.error(error)
        return createError({
            status: 500, 
            message: "Failed to load races database"
        })
    }
})
