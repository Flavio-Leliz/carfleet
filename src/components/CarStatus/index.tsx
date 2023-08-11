import { Car, Key } from 'phosphor-react-native'
import { Container, IconBox, Message, TextHighlight } from './styles'
import { useTheme } from 'styled-components/native'
import { TouchableOpacityProps } from 'react-native'

type CarStatusProps = TouchableOpacityProps & {
    licensePlate?: string | null
}

export function CarStatus({ licensePlate = null, ...rest }: CarStatusProps) {
    const theme = useTheme()
    const Icon = licensePlate ? Car : Key
    const message = licensePlate ? `Veículo ${licensePlate} em uso. ` : `Nenhum veículo em uso. `
    const status = licensePlate ? 'chegada' : 'saída'

    return (
        <Container activeOpacity={0.7} {...rest}>
            <IconBox>
                <Icon
                    size={52}
                    color={theme.COLORS.BRAND_LIGHT}
                />
            </IconBox>
            <Message>
                {message}
                <TextHighlight>
                    Clique aqui para registrar a {status}
                </TextHighlight>
            </Message>
        </Container>
    )
}