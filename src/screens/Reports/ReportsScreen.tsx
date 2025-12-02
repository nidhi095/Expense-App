// src/screens/Reports/ReportsScreen.tsx
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDataContext } from '../../context/AppDataContext';

function ReportsScreen({ navigation }: any) {
  const { reports, deleteReport } = useContext(AppDataContext);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Report', 'Are you sure you want to delete this report?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReport(id) },
    ]);
  };

  const handleEdit = (id: string) => {
    navigation.navigate('NewReport', { editId: id });
  };

  const handleView = (item: any) => {
    setSelectedReport(item);
  };

  const handleAdd = () => {
    // ✅ No newCode passed — the AppDataContext will auto-generate unique sequential codes.
    navigation.navigate('NewReport');
  };

  const sortedReports = [...reports].sort((a, b) => {
    const aNum = parseInt((a.reportCode || '').replace('#', '')) || 0;
    const bNum = parseInt((b.reportCode || '').replace('#', '')) || 0;
    return aNum - bNum;
  });

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.reportCode}>{item.reportCode || '#-----'}</Text>
            <Text style={styles.reportTitle}>{item.reportName || 'Untitled Report'}</Text>
          </View>
          <Text style={styles.reportDate}>
            {item.toDate ? new Date(item.toDate).toLocaleDateString() : '--'}
          </Text>
        </View>

        <Text style={styles.purpose}>{item.purpose || '—'}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleView(item)}>
              <Icon name="eye-outline" size={20} color="#3949AB" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(item.id)}>
              <Icon name="pencil-outline" size={20} color="#6A0DAD" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(item.id)}>
              <Icon name="delete-outline" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6A0DAD" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Icon name="plus" size={26} color="#6A0DAD" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No reports found.</Text>}
      />

      {/* View Modal */}
      <Modal visible={!!selectedReport} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedReport && (
              <>
                <Text style={styles.modalTitle}>{selectedReport.reportName}</Text>
                <Text>Code: {selectedReport.reportCode}</Text>
                <Text>Purpose: {selectedReport.purpose || '-'}</Text>
                <Text>
                  From: {new Date(selectedReport.fromDate).toLocaleDateString()}
                </Text>
                <Text>To: {new Date(selectedReport.toDate).toLocaleDateString()}</Text>
                <Text>Status: {selectedReport.status}</Text>
                {selectedReport.tripId && <Text>Trip ID: {selectedReport.tripId}</Text>}
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedReport(null)}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#6A0DAD',
    alignItems: 'center',
  },
  backButton: { backgroundColor: '#8E24AA', padding: 6, borderRadius: 8 },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 20 },
  addButton: { backgroundColor: '#fff', padding: 8, borderRadius: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportCode: { color: '#AAA', fontSize: 13 },
  reportTitle: { color: '#333', fontSize: 16, fontWeight: '600' },
  reportDate: { color: '#999', fontSize: 13 },
  purpose: { color: '#666', fontSize: 14, marginVertical: 6 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#EEE', padding: 4, borderRadius: 6 },
  statusText: { fontWeight: '600', fontSize: 13 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  leftActions: { flexDirection: 'row', gap: 10 },
  iconButton: { padding: 6, borderRadius: 20, backgroundColor: '#EFE6FF' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  closeButton: { backgroundColor: '#6A0DAD', padding: 10, marginTop: 12, borderRadius: 8, alignItems: 'center' },
});

export default ReportsScreen;
