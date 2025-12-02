import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const data = [
  { id: '1', category: 'Travel', count: 4, amount: '1200' },
  { id: '2', category: 'Meals', count: 3, amount: '450' },
  { id: '3', category: 'Supplies', count: 2, amount: '200' },
];

const ExpenseByCategoryReport = ({ navigation }: any) => {
  const [stackedView, setStackedView] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense by Category</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setStackedView(!stackedView)}>
            <Icon
              name={stackedView ? 'view-list' : 'view-split-vertical'}
              size={22}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 16 }}>
            <Icon name="download-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.rangeText}>From 01-Oct-2025 To 27-Oct-2025</Text>

        {stackedView ? (
          data.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.category}</Text>
              <Text>Count: {item.count}</Text>
              <Text>Amount: {item.amount}</Text>
            </View>
          ))
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColHeader}>Category</Text>
              <Text style={styles.tableColHeader}>Count</Text>
              <Text style={styles.tableColHeader}>Amount</Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.cell}>{item.category}</Text>
                  <Text style={styles.cell}>{item.count}</Text>
                  <Text style={styles.cell}>{item.amount}</Text>
                </View>
              )}
            />
          </>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Action</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
              <Text>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
              <Text>Print</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={{ color: '#6A0DAD' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  content: { padding: 20 },
  rangeText: { marginBottom: 16, color: '#6A0DAD', fontWeight: '600' },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#CCC', paddingBottom: 8 },
  tableColHeader: { fontWeight: '700', color: '#6A0DAD', width: '33%' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  cell: { width: '33%', color: '#333' },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 14, marginVertical: 8 },
  cardTitle: { fontWeight: '700', color: '#6A0DAD', marginBottom: 6 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { backgroundColor: '#FFF', borderRadius: 10, padding: 20, width: 220, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  modalBtn: { paddingVertical: 10 },
  modalCancel: { marginTop: 10 },
});

export default ExpenseByCategoryReport;
