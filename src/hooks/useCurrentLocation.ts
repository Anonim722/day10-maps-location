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
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            })
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
