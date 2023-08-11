import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { Container, Content, MenssageContent, Message } from './styles'
import { Alert, ScrollView, TextInput } from 'react-native'
import { LicensePlateValidate } from '../../utils/licensePlateValidate'
import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { useUser } from '@realm/react'
import { useNavigation } from '@react-navigation/native'
import {
    LocationAccuracy,
    LocationObjectCoords,
    LocationSubscription,
    useForegroundPermissions,
    requestBackgroundPermissionsAsync,
    watchPositionAsync
} from 'expo-location'
import { getAddressLocation } from '../../utils/getAddressLocation'
import { Loading } from '../../components/Loading'
import { LocationInfo } from '../../components/LocationInfo'
import { Car } from 'phosphor-react-native'
import { Map } from '../../components/Map'
import { startLocationTast } from '../../tasks/backgroundTaskLocation'
import { OpenSettings } from '../../utils/openSettings'


export function Departure() {
    const [description, setDescription] = useState('')
    const [licensePlate, setLicensePlate] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [isLoadingLocation, setIsLoadingLocation] = useState(true)
    const [currentAddress, setCurrentAddress] = useState<string | null>(null)
    const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null)
    const user = useUser()

    const [locationForegroundPermissions, requestLocationForegroundPermissions] = useForegroundPermissions()
    const { goBack } = useNavigation()

    //acessando banco de dados
    const realm = useRealm()

    const descriptionRef = useRef<TextInput>(null)

    async function handleDepartureRegister() {
        try {
            if (!LicensePlateValidate(licensePlate)) {
                return Alert.alert('Placa inválida', 'Por favor informar a placa corretamente')
            }

            if (description.trim().length === 0) {
                return Alert.alert('Finalidade', 'Por favor informar a finalidade da utilização do veículo')
            }

            if (!currentCoords?.latitude && !currentCoords?.longitude) {
                return Alert.alert('Localização', 'Não foi possível obter a localização atual. Tente novamente')
            }

            setIsRegistering(true)

            const backgroundPermissions = await requestBackgroundPermissionsAsync()

            if (!backgroundPermissions.granted) {
                setIsRegistering(true)

                return Alert.alert('Permissões',
                    'É necessário que o App tenha acesso a sua localização em segundo plano. Acesse as configuração do dispositivo e habilite "Permitir o tempo todo"',
                    [{ text: "Abrir configurações", onPress: OpenSettings }]
                )
            }

            await startLocationTast()

            // sempre usando o 'write' para modificar o DB.
            realm.write(() => {
                //create('nome da coleção', Schema)
                realm.create('Historic', Historic.generate({
                    user_id: user!.id,
                    license_plate: licensePlate.toUpperCase(),
                    description,
                    coords: [{
                        latitude: currentCoords.latitude,
                        longitude: currentCoords.longitude,
                        timestamp: new Date().getTime()
                    }]
                }))
            })

            Alert.alert('Saída', 'Saída do veículo registrada com sucesso')
            goBack()


        } catch (error) {
            Alert.alert('Error', 'Não foi possível registrar a saída vaículo')
            setIsRegistering(false)
        }
    }

    // solicitando acesso a localização do dispositivo
    useEffect(() => {
        requestLocationForegroundPermissions()
    }, [])

    // obtendo as coordenadas no mapa
    useEffect(() => {
        if (!locationForegroundPermissions?.granted) {
            return
        }

        let subscription: LocationSubscription

        watchPositionAsync({
            accuracy: LocationAccuracy.High,
            timeInterval: 1000
        }, (location) => {
            setCurrentCoords(location.coords)

            getAddressLocation(location.coords)
                .then((address) => {
                    if (address) {
                        setCurrentAddress(address)
                    }
                })
                .finally(() => setIsLoadingLocation(false))

        }).then((response) => subscription = response)

        return () => {
            if (subscription) {
                subscription.remove()
            }
        }
    }, [locationForegroundPermissions])

    // verificando se há permissão para acessar a localização do dispositivo
    if (!locationForegroundPermissions?.granted) {
        return (
            <Container>
                <Header title='Saída' />
                <MenssageContent>
                    <Message>
                        Você precisa permitir o acesso a sua localização para utilizar essa funcionalidade.
                        Acesse as configurações do dispositivo e permita o acesso a sua localização.
                    </Message>

                    <Button title='Abrir configurações' onPress={OpenSettings} />
                </MenssageContent>
            </Container>
        )
    }

    if (isLoadingLocation) {
        return (
            <Loading />
        )
    }

    return (
        <Container>
            <Header title='Saída' />

            <ScrollView>
                {
                    currentCoords && <Map coordinates={[currentCoords]} />
                }

                <Content>
                    {
                        currentAddress &&
                        <LocationInfo
                            label='Localização atual'
                            description={currentAddress}
                            icon={Car}
                        />
                    }

                    <LicensePlateInput
                        label='Placa do veículo'
                        placeholder='BRA2R19'
                        onSubmitEditing={() => descriptionRef.current?.focus()}
                        onChangeText={setLicensePlate}
                        returnKeyType='next'
                    />
                    <TextAreaInput
                        ref={descriptionRef}
                        label='Finalidade'
                        placeholder='Vou utilizar o carro para...'
                        onSubmitEditing={handleDepartureRegister}
                        blurOnSubmit
                        returnKeyType='next'
                        onChangeText={setDescription}
                    />

                    <Button
                        title='Registrar Saída'
                        onPress={handleDepartureRegister}
                        isLoading={isRegistering}
                    />
                </Content>
            </ScrollView>
        </Container>
    )
}