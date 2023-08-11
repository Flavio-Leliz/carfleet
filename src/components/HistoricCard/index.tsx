import { Container, Content, DepartureDate, LicensePlate } from "./styles";
import { TouchableOpacityProps } from 'react-native'
import { Check, ClockClockwise } from 'phosphor-react-native'
import { useTheme } from "styled-components/native";

export type HistoricCardProps = {
    id: string
    licensePlate: string
    created: string
    isSync: boolean
}

type Props = TouchableOpacityProps & {
    data: HistoricCardProps
}

export function HistoricCard({ data, ...rest }: Props) {
    const theme = useTheme()

    return (
        <Container {...rest} activeOpacity={0.7}>
            <Content>
                <LicensePlate>
                    {data.licensePlate}
                </LicensePlate>
                <DepartureDate>
                    {data.created}
                </DepartureDate>
            </Content>

            {
                data.isSync ?
                    <Check
                        size={24}
                        color={theme.COLORS.BRAND_LIGHT}
                    />
                    :
                    <ClockClockwise
                        size={24}
                        color={theme.COLORS.GRAY_400}
                    />
            }
        </Container>
    )
}