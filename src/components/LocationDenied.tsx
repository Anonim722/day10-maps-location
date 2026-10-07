import React from 'react'
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native'

export function LocationDenied() {
    const handleOpenSettings = () => {
        Linking.openSettings()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>🔒</Text>
            <Text style={styles.title}>Доступ вимкнено</Text>
            <Text style={styles.description}>
                Ви відхилили дозвіл на геопозицію. Будь ласка, перейдіть до системних налаштувань, щоб увімкнути його
                вручну.
            </Text>
            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={handleOpenSettings}
            >
                <Text style={styles.buttonText}>Відкрити Налаштування</Text>
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
        backgroundColor: '#0F172A',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    buttonPressed: { opacity: 0.8 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
})
