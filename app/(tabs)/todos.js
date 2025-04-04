import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function TodosScreen() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos([
                ...todos,
                {
                    id: Date.now().toString(),
                    text: newTodo,
                    completed: false,
                },
            ]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            <TouchableOpacity
                style={styles.todoContent}
                onPress={() => toggleTodo(item.id)}
            >
                <FontAwesome
                    name={item.completed ? 'check-circle' : 'circle-o'}
                    size={24}
                    color={item.completed ? '#4CAF50' : '#757575'}
                />
                <Text
                    style={[
                        styles.todoText,
                        item.completed && styles.completedTodo,
                    ]}
                >
                    {item.text}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={styles.deleteButton}
            >
                <FontAwesome name="trash" size={20} color="#FF5252" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newTodo}
                        onChangeText={setNewTodo}
                        placeholder="Add a new todo..."
                        onSubmitEditing={addTodo}
                    />
                    <TouchableOpacity onPress={addTodo} style={styles.addButton}>
                        <FontAwesome name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={todos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 10,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    todoContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    completedTodo: {
        textDecorationLine: 'line-through',
        color: '#757575',
    },
    deleteButton: {
        padding: 5,
    },
}); 