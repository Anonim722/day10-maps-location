import { useState, useEffect, useCallback } from 'react'
import * as Location from 'expo-location'

export type PermissionState = 'loading' | 'undetermined' | 'granted' | 'denied'

function toPermissionState(status: Location.PermissionStatus): PermissionState {
    switch (status) {
        case Location.PermissionStatus.GRANTED:
            return 'granted'
        case Location.PermissionStatus.DENIED:
            return 'denied'
        default:
            return 'undetermined'
    }
}

export function useLocationPermission() {
    const [status, setStatus] = useState<PermissionState>('loading')

    const checkPermission = useCallback(async () => {
        try {
            const result = await Location.getForegroundPermissionsAsync()

            if (!result.canAskAgain && result.status !== Location.PermissionStatus.GRANTED) {
                setStatus('denied')
                return
            }

            setStatus(toPermissionState(result.status))
        } catch {
            setStatus('denied')
        }
    }, [])

    const requestPermission = useCallback(async (): Promise<boolean> => {
        try {
            setStatus('loading')
            const result = await Location.requestForegroundPermissionsAsync()
            const granted = result.status === Location.PermissionStatus.GRANTED
            setStatus(granted ? 'granted' : 'denied')
            return granted
        } catch {
            setStatus('denied')
            return false
        }
    }, [])

    useEffect(() => {
        checkPermission()
    }, [checkPermission])

    return {
        status,
        requestPermission,
        recheckPermission: checkPermission,
    }
}
