import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalSelector from 'react-native-modal-selector';
import { AppDataContext } from '../context/AppDataContext';

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

const TripsApprovalScreen = ({ navigation }) => {
  const { trips = [], updateTripStatus } = useContext(AppDataContext);
  const [status, setStatus] = useState('All Trips');

  const statusOptions = ['All Trips','Pending','Approved','Rejected','Closed','Cancelled','Archived'];
  const filteredTrips = status === 'All Trips' ? trips : trips.filter((t) => t.status === status);

  const renderTripCard = ({ item, index }) => {
    const tripNumber = `TRIP-${String(index + 1).padStart(5, '0')}`;
    const { color, icon } = getStatusStyle(item.status);
    const modalData = statusOptions.filter((s) => s !== 'All Trips').map((s) => ({ key: s, label: s }));

    return (
      <View style={styles.tripCard}>
        <TouchableOpacity
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

          {/* ✅ Fixed Dropdown */}
          <ModalSelector
            data={modalData}
            initValue={item.status || 'Pending'}
            onChange={(option) => updateTripStatus(item.id, option.label)}
            cancelText="Cancel"
            optionContainerStyle={{ backgroundColor: '#FFF' }}
            overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            <View style={styles.pickerReplacement}>
              <Text style={{ color: '#333', flex: 1 }}>{item.status || 'Pending'}</Text>
              <Icon name="chevron-down" size={20} color="#6A0DAD" />
            </View>
          </ModalSelector>
        </TouchableOpacity>
      </View>
    );
  };

  const modalFilterData = statusOptions.map((s) => ({ key: s, label: s }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trips Approval</Text>
          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.headerLabel}>Status</Text>

        {/* ✅ Filter Dropdown */}
        <ModalSelector
          data={modalFilterData}
          initValue={status}
          onChange={(option) => setStatus(option.label)}
          cancelText="Cancel"
          optionContainerStyle={{ backgroundColor: '#FFF' }}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <View style={styles.pickerWhiteReplacement}>
            <Text style={{ color: '#333', flex: 1 }}>{status}</Text>
            <Icon name="chevron-down" size={20} color="#6A0DAD" />
          </View>
        </ModalSelector>
      </LinearGradient>

      <FlatList
        data={filteredTrips}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No trips to approve.</Text>}
        renderItem={renderTripCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: { padding: 16, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  headerLabel: { color: '#FFF', fontWeight: '600', marginBottom: 6 },
  tripCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
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
  pickerWhiteReplacement: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});

export default TripsApprovalScreen;
