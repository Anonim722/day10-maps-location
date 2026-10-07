import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

interface Props {
    onRequest: () => void
}

export function LocationPermissionRequest({ onRequest }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.title}>Доступ до геопозиції</Text>
            <Text style={styles.description}>
                Щоб переглядати карту та зберігати цікаві місця навколо вас, додатку потрібен доступ до геолокації.
            </Text>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onRequest}>
                <Text style={styles.buttonText}>Надати доступ</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#F8FAFC',
    },
    icon: { fontSize: 64, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
    description: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    buttonPressed: { opacity: 0.8 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
})
