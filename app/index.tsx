import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, AppState, Pressable } from 'react-native'
import MapView, { MapPressEvent, Region } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useLocationPermission } from '../src/hooks/useLocationPermission'
import { useCurrentLocation } from '../src/hooks/useCurrentLocation'
import { LocationPermissionRequest } from '../src/components/LocationPermissionRequest'
import { LocationDenied } from '../src/components/LocationDenied'
import { UserMarker } from '../src/components/UserMarker'
import { PlaceMarker } from '../src/components/PlaceMarker'
import { Coordinates, PlacePin } from '../src/types/map'

// Дефолтний регіон на випадок відсутності координат (Київ)
const DEFAULT_REGION: Region = {
    latitude: 50.4501,
    longitude: 30.5234,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}

const USER_REGION_DELTA = 0.01
const CAMERA_ANIMATION_MS = 800

export default function MapScreen() {
    const mapRef = useRef<MapView>(null)
    const [pins, setPins] = useState<PlacePin[]>([])

    const { status, requestPermission, recheckPermission } = useLocationPermission()
    const { coords, loading: coordsLoading, error: coordsError, fetchLocation } = useCurrentLocation()

    const animateToCoords = useCallback((target: Coordinates) => {
        mapRef.current?.animateToRegion(
            {
                latitude: target.latitude,
                longitude: target.longitude,
                latitudeDelta: USER_REGION_DELTA,
                longitudeDelta: USER_REGION_DELTA,
            },
            CAMERA_ANIMATION_MS,
        )
    }, [])

    // Повторна перевірка статусу при поверненні з Налаштувань
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') {
                recheckPermission()
            }
        })

        return () => subscription.remove()
    }, [recheckPermission])

    // Завантаження координат при отриманні дозволу
    useEffect(() => {
        if (status === 'granted') {
            fetchLocation()
        }
    }, [status, fetchLocation])

    // Автоматичне центрування при отриманні нових координат
    useEffect(() => {
        if (coords) {
            animateToCoords(coords)
        }
    }, [coords, animateToCoords])

    const handleMapPress = useCallback((event: MapPressEvent) => {
        // На Android тап по маркеру теж викликає onPress карти — ігноруємо його
        if (event.nativeEvent.action === 'marker-press') {
            return
        }

        const { coordinate } = event.nativeEvent

        setPins((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                title: `Місце #${prev.length + 1}`,
                coordinate,
                createdAt: new Date().toLocaleString('uk-UA'),
            },
        ])
    }, [])

    const handleRemovePin = useCallback((pinId: string) => {
        setPins((prev) => prev.filter((pin) => pin.id !== pinId))
    }, [])

    const handleCenterOnUser = useCallback(() => {
        if (coords) {
            animateToCoords(coords)
        } else {
            fetchLocation()
        }
    }, [coords, animateToCoords, fetchLocation])

    // Стан 1: Завантаження перевірки дозволу
    if (status === 'loading') {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Перевірка дозволів...</Text>
            </View>
        )
    }

    // Стан 2: Дозвіл ще не запитувався
    if (status === 'undetermined') {
        return <LocationPermissionRequest onRequest={requestPermission} />
    }

    // Стан 3: Дозвіл відхилено
    if (status === 'denied') {
        return <LocationDenied />
    }

    // Стан 4: Дозвіл надано — рендеримо карту
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={DEFAULT_REGION}
                    onPress={handleMapPress}
                    showsCompass
                    showsScale
                >
                    {/* Маркер поточної локації користувача */}
                    {coords && <UserMarker coordinate={coords} />}

                    {/* Маркери улюблених місць */}
                    {pins.map((pin) => (
                        <PlaceMarker key={pin.id} pin={pin} onRemove={handleRemovePin} />
                    ))}
                </MapView>

                {/* Плаваюча панель з підказкою та кількістю точок */}
                <View style={styles.headerBadge}>
                    <Text style={styles.badgeTitle}>📍 Збережено місць: {pins.length}</Text>
                    <Text style={styles.badgeSubtitle}>Тапніть по карті, щоб поставити мітку</Text>
                    {coordsError && <Text style={styles.badgeError}>Не вдалося визначити геопозицію: {coordsError}</Text>}
                </View>

                {/* Кнопка швидкого центрування на собі */}
                <Pressable
                    style={({ pressed }) => [styles.myLocationButton, pressed && styles.buttonPressed]}
                    onPress={handleCenterOnUser}
                    disabled={coordsLoading}
                >
                    {coordsLoading ? (
                        <ActivityIndicator size="small" color="#2563EB" />
                    ) : (
                        <Text style={styles.myLocationIcon}>🎯</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748B',
    },
    map: {
        flex: 1,
    },
    headerBadge: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        alignItems: 'center',
    },
    badgeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    badgeSubtitle: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },
    badgeError: {
        fontSize: 11,
        color: '#EF4444',
        marginTop: 2,
        maxWidth: 280,
        textAlign: 'center',
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 28,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    myLocationIcon: {
        fontSize: 24,
    },
    buttonPressed: {
        opacity: 0.75,
    },
})
