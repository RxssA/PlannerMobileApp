import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getActivities } from "../Api";

const HomeScreen = ({ navigation }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        getActivities().then(response => setActivities(response.data));
    }, []);

    return (
        <View>
            <FlatList
                data={activities}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("Chat", { activity: item })}>
                        <Text>{item.title} - {new Date(item.date).toDateString()}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default HomeScreen;
