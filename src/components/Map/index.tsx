import MapView, { LatLng, MapViewProps, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import { IconBox } from '../IconBox'
import { Car, FlagCheckered } from 'phosphor-react-native'
import { useRef } from 'react'
import { useTheme } from 'styled-components/native'

type MapProps = MapViewProps & {
    coordinates: LatLng[]
}

export function Map({ coordinates, ...rest }: MapProps) {
    const mapRef = useRef<MapView>(null)

    const lastCoordinates = coordinates[coordinates.length - 1]
    const theme = useTheme()

    // funlção que irá ajustar o mapa para exibir os pontos de partida e chegada
    async function onMapLoaded() {
        if (coordinates.length > 1) {
            mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
            })
        }
    }

    return (
        // component de redenrização do mapa
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ width: '100%', height: 200 }}

            // região que será exibida ao abrir o mapa
            region={{
                latitude: lastCoordinates.latitude,
                longitude: lastCoordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
            onMapLoaded={onMapLoaded}
            {...rest}
        >
            <Marker identifier='departure' coordinate={coordinates[0]}>
                <IconBox
                    size='small'
                    icon={Car}
                />
            </Marker>

            {
                coordinates.length > 1 &&

                <>
                    <Marker identifier='arrival' coordinate={lastCoordinates}>
                        <IconBox
                            size='small'
                            icon={FlagCheckered}
                        />
                    </Marker>

                    <Polyline
                        coordinates={[...coordinates]}
                        strokeColor={theme.COLORS.GRAY_700}
                        strokeWidth={6}
                    />
                </>
            }
        </MapView>
    )
}