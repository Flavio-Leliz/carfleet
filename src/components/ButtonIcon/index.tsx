import { IconProps, X } from "phosphor-react-native";
import { Container } from "./styles";
import { useTheme } from "styled-components/native";
import { TouchableOpacityProps } from 'react-native'

export type IconBoxProps = (props: IconProps) => JSX.Element

type ButtonIconProps = TouchableOpacityProps & {
    icon: IconBoxProps
}

export function ButtonIcon({ icon: Icon, ...rest }: ButtonIconProps) {
    const theme = useTheme()
    return (
        <Container activeOpacity={0.7} {...rest}>
            <Icon
                size={24}
                color={theme.COLORS.BRAND_MID}
            />
        </Container>
    )
}