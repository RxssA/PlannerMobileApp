import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { getActivities, createActivity, deleteActivity, createUser, login } from "../../src/Api";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { TextInput, Button } from "react-native";

const API_URL = "http://10.12.21.3:5000/api";

export default function Home() {
    const router = useRouter();
    const [activities, setActivities] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [signupModalVisible, setSignupModalVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [newActivity, setNewActivity] = useState({ title: '', date: '', description: '' });
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (token) {
            loadActivities();
        }
    }, [token]);

    const loadActivities = async () => {
        try {
            const response = await getActivities(token);
            if (response && response.data) {
                setActivities(response.data);
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error('Error loading activities:', error);
            Alert.alert('Error', 'Failed to load activities');
            setActivities([]);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await login(loginCredentials);
            if (response.data && response.data.token) {
                setToken(response.data.token);
                setLoginModalVisible(false);
                setLoginCredentials({ email: '', password: '' });
                Alert.alert('Success', 'Logged in successfully!');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            const errorMessage = error.message || 'Failed to login. Please try again.';
            Alert.alert('Error', errorMessage);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await createUser(newUser);
            if (response.data && response.data.token) {
                setToken(response.data.token);
                setSignupModalVisible(false);
                setNewUser({ username: '', email: '', password: '' });
                Alert.alert('Success', 'Account created successfully!');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            Alert.alert('Error', 'Failed to create account. Please try again.');
        }
    };

    const handleCreateActivity = async () => {
        try {
            const response = await createActivity(newActivity, token);
            if (response.data) {
                setModalVisible(false);
                setNewActivity({ title: '', date: '', description: '' });
                loadActivities();
            }
        } catch (error) {
            console.error('Error creating activity:', error);
            Alert.alert('Error', 'Failed to create activity. Please try again.');
        }
    };

    const handleDeleteActivity = async (id) => {
        try {
            await deleteActivity(id, token);
            loadActivities();
        } catch (error) {
            console.error('Error deleting activity:', error);
            Alert.alert('Error', 'Failed to delete activity. Please try again.');
        }
    };

    const navigateToChat = (activity) => {
        try {
            router.push({
                pathname: "/chat",
                params: { activity: JSON.stringify(activity) }
            });
        } catch (error) {
            console.error('Error navigating to chat:', error);
            Alert.alert('Error', 'Failed to navigate to chat');
        }
    };

    const handleLogout = () => {
        setToken(null);
        setActivities([]);
        Alert.alert('Success', 'Logged out successfully!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerButtons}>
                {!token ? (
                    <>
                        <TouchableOpacity 
                            style={styles.loginButton}
                            onPress={() => setLoginModalVisible(true)}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.signupButton}
                            onPress={() => setSignupModalVisible(true)}
                        >
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity 
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {token ? (
                activities.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No activities found</Text>
                        <Text style={styles.emptyStateSubtext}>Create a new activity to get started!</Text>
                    </View>
                ) : (
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
                                    <Button title="Delete" onPress={() => handleDeleteActivity(item._id)} />
                                </View>
                                <Text style={styles.activityDate}>
                                    {new Date(item.date).toLocaleDateString()}
                                </Text>
                                <Text style={styles.activityDescription}>{item.description}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Welcome to Group Planner</Text>
                    <Text style={styles.emptyStateSubtext}>Please login or sign up to get started!</Text>
                </View>
            )}

            {token && (
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>
            )}

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
                            onChangeText={(text) => setNewActivity({ ...newActivity, title: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            value={newActivity.date}
                            onChangeText={(text) => setNewActivity({ ...newActivity, date: text })}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description"
                            value={newActivity.description}
                            onChangeText={(text) => setNewActivity({ ...newActivity, description: text })}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Create" onPress={handleCreateActivity} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Sign Up Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={signupModalVisible}
                onRequestClose={() => setSignupModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Account</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={newUser.username}
                            onChangeText={(text) => setNewUser({ ...newUser, username: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={newUser.email}
                            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={newUser.password}
                            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                            secureTextEntry
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setSignupModalVisible(false)} />
                            <Button title="Sign Up" onPress={handleSignup} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Login Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={loginModalVisible}
                onRequestClose={() => setLoginModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Login</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={loginCredentials.email}
                            onChangeText={(text) => setLoginCredentials({ ...loginCredentials, email: text })}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={loginCredentials.password}
                            onChangeText={(text) => setLoginCredentials({ ...loginCredentials, password: text })}
                            secureTextEntry
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setLoginModalVisible(false)} />
                            <Button title="Login" onPress={handleLogin} />
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
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 5,
        marginLeft: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptyStateSubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
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
        marginBottom: 5,
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