//gerencia o processo fora do app, no navegador do android
import * as webBrowser from 'expo-web-browser'

//autenticação pelo google oauth
import * as Google from 'expo-auth-session/providers/google'

import { Container, Slogan, Title } from './styles'
import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button'
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Realm, useApp } from '@realm/react'

//gerencia o processo fora do app, no navegador do android
webBrowser.maybeCompleteAuthSession()

export function SignIn() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const app = useApp()
    const [_, response, googleSignIn] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ['profile', 'email']
    })

    // login com google oauth2
    function handleGoogleSignIn() {
        setIsAuthenticating(true)

        googleSignIn().then((response) => {
            if (response.type !== 'success') {
                setIsAuthenticating(false)
            }
        })
    }

    // buscando dados do usuário definidos no 'scopes'
    useEffect(() => {
        if (response?.type === 'success') {
            if (response.authentication?.idToken) {
                // consistindo token no realmDB
                const credentials = Realm.Credentials.jwt(response.authentication.idToken)

                app.logIn(credentials).catch((error) => {
                    console.log(error)
                    Alert.alert('Não foi possível conectar-se a sua conta Google')
                    setIsAuthenticating(false)
                })

                // fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication.idToken}`) // buscando dados pelo frontend
                //     .then((response) => response.json())
                //     .then(console.log)
            } else {
                Alert.alert('Não foi possível conectar-se a sua conta Google')
                setIsAuthenticating(false)
            }
        }
    }, [response])

    return (
        <Container source={backgroundImg}>
            <Title>
                Car Fleet
            </Title>
            <Slogan>
                Gestão de uso de veículos
            </Slogan>

            <Button
                title='Entrar com Google'
                onPress={handleGoogleSignIn}
                isLoading={isAuthenticating}
            />

        </Container>
    );
}

