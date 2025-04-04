import React, { useEffect } from "react";
import { Slot } from "expo-router";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {
    useEffect(() => {
        // Request notification permissions
        async function requestPermissions() {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permissions not granted');
                return;
            }
        }
        requestPermissions();

        // Schedule a test notification
        Notifications.scheduleNotificationAsync({
            content: { 
                title: "Welcome to Group Planner!", 
                body: "Start planning your group activities!" 
            },
            trigger: { seconds: 2 },
        });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
        </GestureHandlerRootView>
    );
}
