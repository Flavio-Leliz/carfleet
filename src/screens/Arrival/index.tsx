import { useNavigation, useRoute } from '@react-navigation/native';
import { AsyncMessage, Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import { stopLocationTask } from '../../tasks/backgroundTaskLocation';
import { getStorageLocation } from '../../libs/asyncStorage/locationStorage';
import { LatLng } from 'react-native-maps';
import { Map } from '../../components/Map';
import { Locations } from '../../components/Locations';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { LocationInfoProps } from '../../components/LocationInfo';
import dayjs from 'dayjs';
import { Loading } from '../../components/Loading';

type RouteParamsProps = {
    id: string
}

export function Arrival() {
    const route = useRoute()
    const realm = useRealm()
    const { goBack } = useNavigation()
    const [dataNoSynced, setDataNoSynced] = useState(false)
    const [coordinates, setCoordinates] = useState<LatLng[]>([])
    const [departure, setDeparture] = useState<LocationInfoProps>({} as LocationInfoProps)
    const [arrival, setArrival] = useState<LocationInfoProps | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const { id } = route.params as RouteParamsProps

    // carregando detalhes do banco utilizando id
    const historic = useObject(Historic, new BSON.UUID(id) as unknown as string); // forçar tipagem 'UUID() as unknown as string'

    const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'

    function handleDeleteVehicleUsege() {
        Alert.alert(
            'Cancelar',
            'Cancelar a utilização do veículo',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => deleteVehicle() }
            ]
        )
    }
    async function deleteVehicle() {
        realm.write(() => {
            realm.delete(historic)
        })
        await stopLocationTask()
        goBack()
    }

    async function handleArrivalRegister() {
        try {
            if (historic) {
                const locations = await getStorageLocation()

                realm.write(() => {
                    historic.status = 'arrival'
                    historic.updated_at = new Date()
                    historic.coords.push(...locations)

                    Alert.alert('Chegada', 'Chegada registrada com sucesso')
                    goBack()
                })

                await stopLocationTask()

            } else {
                Alert.alert('Error', 'Não foi possível obter informações do veículo')
            }

        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Não foi possível registrar a chegada do veículo')
        }
    }

    // verificando dados sincronizados com o DB
    async function getLocationInfo() {
        if (!historic) {
            return
        }

        const lastSync = await getLastSyncTimestamp()
        const updatedAt = historic!.updated_at.getTime()
        setDataNoSynced(updatedAt > lastSync)

        if (historic?.status === 'departure') {
            const locationStorage = await getStorageLocation()
            setCoordinates(locationStorage)
        } else {

            setCoordinates(historic?.coords ?? [])
        }

        if (historic?.coords[0]) {
            const departureStreetName = getAddressLocation(historic?.coords[0])

            setDeparture({
                label: `Saindo em ${departureStreetName ?? ''}`,
                description: dayjs(new Date(historic.coords[0].timestamp)).format('DD/MM/YYYY [às] HH:mm')
            })
        }

        if (historic?.status === 'arrival') {
            const lastLocation = historic.coords[historic?.coords.length - 1]
            const arrialStreetName = await getAddressLocation(lastLocation)

            setArrival({
                label: `Chegando em ${arrialStreetName ?? ''}`,
                description: dayjs(new Date(lastLocation.timestamp)).format('DD/MM/YYYY [às] HH:mm')
            })
        }

        setIsLoading(false)
    }

    useEffect(() => {
        getLocationInfo()
    }, [historic])

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <Container>
            <Header
                title={title}
            />

            {
                coordinates.length > 0 &&
                <Map
                    coordinates={coordinates}
                />
            }

            <Content>
                <Locations
                    departure={departure}
                    arrival={arrival}
                />

                <Label>
                    Placa do veículo
                </Label>

                <LicensePlate>
                    {historic?.license_plate}
                </LicensePlate>

                <Label>
                    Finalidade
                </Label>

                <Description>
                    {historic?.description}
                </Description>
            </Content>

            {
                historic?.status === 'departure' &&
                <Footer>
                    <ButtonIcon
                        icon={X}
                        onPress={handleDeleteVehicleUsege}
                    />
                    <Button
                        title='Registrar Chegada'
                        onPress={handleArrivalRegister}
                    />
                </Footer>
            }

            {
                dataNoSynced &&
                <AsyncMessage>
                    Sincronização da {historic?.status === 'departure' ? 'partida' : 'chegada'} pendente
                </AsyncMessage>
            }
        </Container>
    )
}