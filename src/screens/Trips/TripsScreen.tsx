import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalSelector from 'react-native-modal-selector';
import { AppDataContext } from '../../context/AppDataContext';

const formatDisplayDate = (d?: string | Date) => {
  if (!d) return '-';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const month = monthNames[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${month} ${yyyy}`;
  } catch {
    return String(d);
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Approved': return { color: '#2ecc71', icon: 'check-circle-outline' };
    case 'Pending': return { color: '#f1c40f', icon: 'clock-outline' };
    case 'Rejected': return { color: '#e74c3c', icon: 'close-circle-outline' };
    case 'Closed': return { color: '#3498db', icon: 'check-decagram-outline' };
    case 'Cancelled': return { color: '#e67e22', icon: 'cancel' };
    case 'Archived': return { color: '#9b59b6', icon: 'archive-outline' };
    default: return { color: '#7f8c8d', icon: 'file-outline' };
  }
};

const TripCard = ({ item, index, navigation, deleteTrip, updateTripStatus }) => {
  const tripNumber = `TRIP-${String(index + 1).padStart(5, '0')}`;
  const { color, icon } = getStatusStyle(item.status);

  const handleDelete = () => {
    Alert.alert('Delete Trip', 'Are you sure you want to delete this trip?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTrip(item.id) },
    ]);
  };

  const statusOptions = [
    'Pending',
    'Approved',
    'Rejected',
    'Closed',
    'Cancelled',
    'Archived',
  ];

  const modalData = statusOptions.map((s) => ({ key: s, label: s }));

  return (
    <View style={styles.tripCard}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
      >
        <View style={styles.rowWrap}>
          <Text style={styles.tripId}>{tripNumber}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.tripName}>{item.name || 'Untitled Trip'}</Text>
        </View>

        <Text style={styles.tripDates}>
          {formatDisplayDate(item.fromDate)} - {formatDisplayDate(item.toDate)}
        </Text>

        <View style={styles.statusContainer}>
          <Icon name={icon} size={18} color={color} />
          <Text style={[styles.statusText, { color }]}>{item.status || 'Pending'}</Text>
        </View>

        <Text style={styles.tripType}>{item.travelType || 'Domestic'}</Text>

        {/* ✅ Replaced Picker with ModalSelector */}
        <ModalSelector
          data={modalData}
          initValue={item.status || 'Pending'}
          onChange={(option) => updateTripStatus(item.id, option.label)}
          cancelText="Cancel"
          optionTextStyle={{ color: '#333' }}
          optionContainerStyle={{ backgroundColor: '#FFF' }}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <View style={styles.pickerReplacement}>
            <Text style={{ color: '#333', flex: 1 }}>
              {item.status || 'Pending'}
            </Text>
            <Icon name="chevron-down" size={20} color="#6A0DAD" />
          </View>
        </ModalSelector>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteIconContainer}>
        <Icon name="delete-outline" size={22} color="#E53935" />
      </TouchableOpacity>
    </View>
  );
};

const TripsScreen = ({ navigation }) => {
  const { trips = [], deleteTrip, updateTripStatus } = useContext(AppDataContext);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trips</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateTrip')}>
          <Icon name="plus" size={26} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      {trips.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No trips created yet.</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TripCard
              item={item}
              index={index}
              navigation={navigation}
              deleteTrip={deleteTrip}
              updateTripStatus={updateTripStatus}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
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
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  tripCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
  },
  rowWrap: { flexDirection: 'row', alignItems: 'center' },
  tripId: { fontWeight: 'bold', fontSize: 14, color: '#6A0DAD' },
  dot: { marginHorizontal: 5, color: '#6A0DAD', fontWeight: 'bold' },
  tripName: { fontSize: 15, fontWeight: '500', color: '#000' },
  tripDates: { fontSize: 13, color: '#777', marginTop: 4 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statusText: { marginLeft: 6, fontSize: 14, fontWeight: '600' },
  tripType: { fontSize: 13, color: '#6A0DAD', marginTop: 6, fontWeight: '500' },
  pickerReplacement: {
    backgroundColor: '#F4EDFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteIconContainer: { padding: 6, marginLeft: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6A0DAD', fontSize: 15, fontWeight: '500' },
});

export default TripsScreen;
