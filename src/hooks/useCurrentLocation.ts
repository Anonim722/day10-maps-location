import { useState, useCallback } from 'react'
import * as Location from 'expo-location'
import { Coordinates } from '../types/map'

export function useCurrentLocation() {
    const [coords, setCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLocation = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const servicesEnabled = await Location.hasServicesEnabledAsync()
            if (!servicesEnabled) {
                throw new Error('Геолокацію вимкнено на пристрої — увімкніть GPS')
            }

            let position: Location.LocationObject | null = null
            try {
                position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                })
            } catch (currentErr) {
                // На емуляторах та в приміщенні свіжий фікс часто недоступний — беремо останню відому позицію
                position = await Location.getLastKnownPositionAsync()
                if (!position) {
                    throw currentErr
                }
            }

            setCoords({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не вдалося отримати геопозицію')
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        coords,
        loading,
        error,
        fetchLocation,
    }
}
