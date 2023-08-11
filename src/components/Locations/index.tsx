import { Car, FlagCheckered } from "phosphor-react-native";
import { LocationInfo, LocationInfoProps } from "../LocationInfo";
import { Container, Line } from "./styles";

type LocationsProps = {
    departure: LocationInfoProps
    arrival?: LocationInfoProps | null
}

export function Locations({ departure, arrival = null }: LocationsProps) {
    return (
        <Container>
            <LocationInfo
                icon={Car}
                label={departure.label}
                description={departure.description}
            />

            {arrival &&
                <>
                    <Line />

                    <LocationInfo
                        icon={FlagCheckered}
                        label={arrival.label}
                        description={arrival.description}
                    />
                </>
            }
        </Container>
    )
}