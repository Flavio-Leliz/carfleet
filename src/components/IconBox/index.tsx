import { IconProps } from 'phosphor-react-native'
import { Container, SizeProps } from './styles'
import { useTheme } from 'styled-components/native'

export type IconBoxProps = (props: IconProps) => JSX.Element

type Props = {
    size?: SizeProps
    icon: IconBoxProps
}

export function IconBox({ size = 'normal', icon: Icon }: Props) {
    const iconSize = size === 'normal' ? 24 : 16

    const theme = useTheme()

    return (
        <Container size={size}>
            <Icon
                size={iconSize}
                color={theme.COLORS.BRAND_LIGHT}
            />
        </Container>
    )
}