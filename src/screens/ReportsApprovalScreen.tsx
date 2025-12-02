import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
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
    case 'Reimbursed': return { color: '#3498db', icon: 'cash-refund-outline' };
    case 'Archived': return { color: '#9b59b6', icon: 'archive-outline' };
    default: return { color: '#7f8c8d', icon: 'file-outline' };
  }
};

const ReportsApprovalScreen = ({ navigation }) => {
  const { reports = [], updateReportStatus, deleteReport } = useContext(AppDataContext);
  const [viewType, setViewType] = useState('My Approvals');
  const [status, setStatus] = useState('All Reports');

  const viewOptions = ['My Approvals', 'All Approvals'];
  const statusOptions = ['All Reports','Pending','Approved','Rejected','Reimbursed','Archived'];

  const filteredReports = status === 'All Reports'
    ? reports
    : reports.filter((r) => r.status === status);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Report', 'Are you sure you want to delete this report?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReport(id) },
    ]);
  };

  const renderReportCard = ({ item, index }) => {
    const reportNumber = `#ER-${String(index + 1).padStart(5, '0')}`;
    const { color, icon } = getStatusStyle(item.status);
    const modalData = statusOptions.filter((s) => s !== 'All Reports').map((s) => ({ key: s, label: s }));

    return (
      <View style={styles.reportCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}
        >
          <View style={styles.rowWrap}>
            <Text style={styles.reportId}>{reportNumber}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.reportName}>{item.reportName || 'Untitled Report'}</Text>
          </View>

          <Text style={styles.reportDates}>
            {formatDisplayDate(item.fromDate)} - {formatDisplayDate(item.toDate)}
          </Text>

          {item.purpose && <Text style={styles.reportPurpose}>{item.purpose}</Text>}

          <View style={styles.statusContainer}>
            <Icon name={icon} size={18} color={color} />
            <Text style={[styles.statusText, { color }]}>{item.status || 'Pending'}</Text>
          </View>

          {/* ✅ Modal Dropdown */}
          <ModalSelector
            data={modalData}
            initValue={item.status || 'Pending'}
            onChange={(option) => updateReportStatus(item.id, option.label)}
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

        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteIconContainer}>
          <Icon name="delete-outline" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>
    );
  };

  const modalViewData = viewOptions.map((s) => ({ key: s, label: s }));
  const modalStatusData = statusOptions.map((s) => ({ key: s, label: s }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports Approval</Text>
          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.headerLabel}>View</Text>
        <ModalSelector
          data={modalViewData}
          initValue={viewType}
          onChange={(option) => setViewType(option.label)}
          cancelText="Cancel"
        >
          <View style={styles.pickerWhiteReplacement}>
            <Text style={{ color: '#333', flex: 1 }}>{viewType}</Text>
            <Icon name="chevron-down" size={20} color="#6A0DAD" />
          </View>
        </ModalSelector>

        <Text style={styles.headerLabel}>Status</Text>
        <ModalSelector
          data={modalStatusData}
          initValue={status}
          onChange={(option) => setStatus(option.label)}
          cancelText="Cancel"
        >
          <View style={styles.pickerWhiteReplacement}>
            <Text style={{ color: '#333', flex: 1 }}>{status}</Text>
            <Icon name="chevron-down" size={20} color="#6A0DAD" />
          </View>
        </ModalSelector>
      </LinearGradient>

      <FlatList
        data={filteredReports}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No reports found.</Text>}
        renderItem={renderReportCard}
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
  headerLabel: { color: '#FFF', fontWeight: '600', marginTop: 8 },
  pickerWhiteReplacement: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
  },
  rowWrap: { flexDirection: 'row', alignItems: 'center' },
  reportId: { fontWeight: 'bold', fontSize: 14, color: '#6A0DAD' },
  dot: { marginHorizontal: 5, color: '#6A0DAD', fontWeight: 'bold' },
  reportName: { fontSize: 15, fontWeight: '500', color: '#000' },
  reportDates: { fontSize: 13, color: '#777', marginTop: 4 },
  reportPurpose: { fontSize: 13, color: '#555', marginTop: 4 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statusText: { marginLeft: 6, fontSize: 14, fontWeight: '600' },
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
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});

export default ReportsApprovalScreen;
