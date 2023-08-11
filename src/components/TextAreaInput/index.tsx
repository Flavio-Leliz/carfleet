import { useTheme } from 'styled-components/native'
import { Container, Input, Label } from './styles'
import { TextInput, TextInputProps } from 'react-native'
import { forwardRef } from 'react'


type TextAreaInputProps = TextInputProps & {
    label: string
}

// export function TextAreaInput({ label, ...rest }: TextAreaInputProps) {
const TextAreaInput = forwardRef<TextInput, TextAreaInputProps>(({ label, ...rest }, ref) => {
    const theme = useTheme()

    return (
        <Container>
            <Label>
                {label}
            </Label>

            <Input
                as={TextInput} // forçar um TextInput para poder utilizar o ref
                ref={ref}
                placeholderTextColor={theme.COLORS.GRAY_400}
                multiline
                autoCapitalize='sentences'
                {...rest}
            />
        </Container>
    )
})

export { TextAreaInput }