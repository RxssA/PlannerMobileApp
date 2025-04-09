import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#757575',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                },
                headerStyle: {
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="calendar" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="todos"
                options={{
                    title: 'Todos',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="list" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
} 