import { Power } from 'phosphor-react-native'
import { Container, Greeting, Message, Name, Picture } from './styles'
import { Alert, TouchableOpacity } from 'react-native'
import theme from '../../theme'
import { useUser, useApp } from '@realm/react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function HomeHeader() {
    const user = useUser()
    const app = useApp()

    const insets = useSafeAreaInsets()
    const paddingTop = insets.top + 32

    function handleLogout() {
        Alert.alert(
            'Logout',
            'Deseja fazer Logout?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => app.currentUser?.logOut() }
            ]
        )
    }

    return (
        <Container style={{ paddingTop }}>
            <Picture
                source={{ uri: user.profile.pictureUrl }}
                placeholder='L184i9offQof00ayfQay~qj[fQj['
            />
            <Greeting>
                <Message>Olá,</Message>
                <Name>
                    {user.profile.name}
                </Name>
            </Greeting>

            <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
                <Power
                    size={32}
                    color={theme.COLORS.GRAY_400}
                />
            </TouchableOpacity>
        </Container>
    )
}