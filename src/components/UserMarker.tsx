import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Marker } from 'react-native-maps'
import { Coordinates } from '../types/map'

interface Props {
    coordinate: Coordinates
}

export function UserMarker({ coordinate }: Props) {
    return (
        <Marker coordinate={coordinate} tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }} title="Ви тут">
            <View style={styles.pulseRing}>
                <View style={styles.coreDot} />
            </View>
        </Marker>
    )
}

const styles = StyleSheet.create({
    pulseRing: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(37, 99, 235, 0.25)',
        borderWidth: 2,
        borderColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    coreDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2563EB',
    },
})
