import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDataContext } from '../../context/AppDataContext';

const TripDetailsScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const { trips, updateTripStatus, deleteTrip } = useContext(AppDataContext);

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#6A0DAD', fontSize: 16 }}>Trip not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTrip(tripId);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const statusOptions = [
    'Pending',
    'Approved',
    'Rejected',
    'Closed',
    'Cancelled',
    'Archived',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      {/* Content */}
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Trip Name</Text>
            <Text style={styles.value}>{trip.name || '-'}</Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete-outline" size={20} color="#FFF" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Purpose</Text>
        <Text style={styles.value}>{trip.purpose || '-'}</Text>

        <Text style={styles.label}>Travel Type</Text>
        <Text style={styles.value}>{trip.travelType || '-'}</Text>

        <Text style={styles.label}>Created At</Text>
        <Text style={styles.value}>{trip.createdAt || '-'}</Text>

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={trip.status}
            onValueChange={(val) => updateTripStatus(trip.id, val)}
          >
            {statusOptions.map((opt) => (
              <Picker.Item label={opt} value={opt} key={opt} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    elevation: 5,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  body: { padding: 20 },
  label: { color: '#6A0DAD', fontWeight: '600', marginTop: 12, marginBottom: 4 },
  value: {
    color: '#333',
    fontSize: 15,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 13,
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default TripDetailsScreen;
