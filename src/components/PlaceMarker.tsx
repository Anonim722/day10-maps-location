import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Marker, Callout } from 'react-native-maps'
import { PlacePin } from '../types/map'

interface Props {
    pin: PlacePin
    onRemove: (id: string) => void
}

export function PlaceMarker({ pin, onRemove }: Props) {
    return (
        <Marker coordinate={pin.coordinate} tracksViewChanges={false} anchor={{ x: 0.5, y: 1.0 }}>
            <View style={styles.pinWrapper}>
                <Text style={styles.pinIcon}>📍</Text>
            </View>
            <Callout tooltip onPress={() => onRemove(pin.id)}>
                <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{pin.title}</Text>
                    <Text style={styles.calloutSubtitle}>{pin.createdAt}</Text>
                    <Text style={styles.calloutDeleteText}>🗑 Натисніть, щоб видалити</Text>
                </View>
            </Callout>
        </Marker>
    )
}

const styles = StyleSheet.create({
    pinWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinIcon: {
        fontSize: 32,
    },
    calloutContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        minWidth: 160,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        alignItems: 'center',
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    calloutSubtitle: {
        fontSize: 11,
        color: '#64748B',
        marginBottom: 6,
    },
    calloutDeleteText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '600',
    },
})
