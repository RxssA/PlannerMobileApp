import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { getActivities } from "../Api";

const HomeScreen = ({ navigation }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await getActivities();
                setActivities(response.data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchActivities();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity 
                onPress={() => navigation.navigate("ChatScreen", { activity: { messages: [] }})}
                style={{ padding: 20, backgroundColor: '#007bff', marginBottom: 20, borderRadius: 5 }}
            >
            </TouchableOpacity>
            {activities.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No activities found</Text>
            ) : (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("ChatScreen", { activity: item })}
                            style={{ padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
                            <Text style={{ color: '#666' }}>{new Date(item.date).toDateString()}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default HomeScreen;
