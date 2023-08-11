import { reverseGeocodeAsync } from "expo-location";

type getAddressLocationProps = {
    latitude: number
    longitude: number
}

export async function getAddressLocation({ latitude, longitude }: getAddressLocationProps) {
    try {
        const addressResponse = await reverseGeocodeAsync({ latitude, longitude })

        return addressResponse[0]?.street
    } catch (error) {
        console.log(error)
    }
}