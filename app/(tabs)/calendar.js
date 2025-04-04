import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('');

    const markedDates = {
        [selectedDate]: {
            selected: true,
            selectedColor: '#007AFF',
        },
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Calendar
                    onDayPress={day => setSelectedDate(day.dateString)}
                    markedDates={markedDates}
                    theme={{
                        selectedDayBackgroundColor: '#007AFF',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#007AFF',
                        arrowColor: '#007AFF',
                    }}
                />
                <View style={styles.eventsContainer}>
                    <Text style={styles.eventsTitle}>Events for {selectedDate || 'Selected Date'}</Text>
                    <View style={styles.eventList}>
                        {/* Event list will be populated here */}
                    </View>
                </View>
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
    eventsContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        marginTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    eventsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    eventList: {
        flex: 1,
    },
}); 