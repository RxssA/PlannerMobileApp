import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { getActivities, createActivity } from "../../src/Api";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { TextInput, Button } from "react-native";

export default function Home() {
    const router = useRouter();
    const [activities, setActivities] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newActivity, setNewActivity] = useState({ title: '', date: '', description: '' });

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = () => {
        getActivities().then(response => setActivities(response.data));
    };

    const handleCreateActivity = () => {
        createActivity(newActivity).then(() => {
            setModalVisible(false);
            setNewActivity({ title: '', date: '', description: '' });
            loadActivities();
        });
    };

    const navigateToChat = (activity) => {
        try {
            router.push({
                pathname: "/chat",
                params: { activity: JSON.stringify(activity) }
            });
        } catch (error) {
            console.error('Error navigating to chat:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={activities}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => navigateToChat(item)}
                        style={styles.activityCard}
                    >
                        <View style={styles.activityHeader}>
                            <Text style={styles.activityTitle}>{item.title}</Text>
                            <Text style={styles.activityDate}>
                                {new Date(item.date).toLocaleDateString()}
                            </Text>
                        </View>
                        <Text style={styles.activityDescription}>{item.description}</Text>
                    </TouchableOpacity>
                )}
            />
            
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Activity</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Activity Title"
                            value={newActivity.title}
                            onChangeText={(text) => setNewActivity({...newActivity, title: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            value={newActivity.date}
                            onChangeText={(text) => setNewActivity({...newActivity, date: text})}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description"
                            value={newActivity.description}
                            onChangeText={(text) => setNewActivity({...newActivity, description: text})}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Create" onPress={handleCreateActivity} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    activityCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    activityDate: {
        color: '#666',
    },
    activityDescription: {
        color: '#444',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
}); 