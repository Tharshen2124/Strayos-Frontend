const apiKey = process.env.NEXT_PUBLIC_ACCESS_GOOGLE_MAPS_API_KEY as string
const mapId = process.env.NEXT_PUBLIC_ACCESS_GOOGLE_MAPS_ID as string
const apiUrl = process.env.NEXT_PUBLIC_ACCESS_API_URL as string
const clientId = process.env.NEXT_PUBLIC_ACCESS_GOOGLE_CLIENT_ID as string
const clientSecret = process.env.NEXT_PUBLIC_ACCESS_GOOGLE_CLIENT_SECRET

export {
    apiKey,
    mapId,
    apiUrl,
    clientId,
    clientSecret
}