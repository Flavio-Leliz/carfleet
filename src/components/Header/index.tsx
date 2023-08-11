import { TouchableOpacity } from 'react-native';
import { Container, Title } from './styles';
import { ArrowLeft } from 'phosphor-react-native';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
    title: string
}

export function Header({ title }: HeaderProps) {
    const theme = useTheme()
    const insets = useSafeAreaInsets()
    const { goBack } = useNavigation()

    const paddingTop = insets.top + 42
    return (
        <Container style={{ paddingTop }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={goBack}
            >
                <ArrowLeft
                    size={24}
                    weight='bold'
                    color={theme.COLORS.BRAND_LIGHT}
                />
            </TouchableOpacity>

            <Title>
                {title}
            </Title>
        </Container>
    )
}