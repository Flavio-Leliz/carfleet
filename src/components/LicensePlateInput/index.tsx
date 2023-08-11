import { useTheme } from "styled-components/native";
import { Container, Input, Label } from "./styles";
import { TextInputProps } from 'react-native'


type LicensePlateInputProps = TextInputProps & {
    label: string
}

export function LicensePlateInput({ label, ...rest }: LicensePlateInputProps) {
    const theme = useTheme()

    return (
        <Container>
            <Label>
                {label}
            </Label>
            <Input
                maxLength={7}
                autoCapitalize='characters'
                placeholderTextColor={theme.COLORS.GRAY_400}
                {...rest}
            />
        </Container>
    )
}
