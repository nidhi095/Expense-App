// src/screens/Expense/ExpenseHandlingScreen.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDataContext } from '../../context/AppDataContext';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const ExpenseHandlingScreen = ({ navigation }) => {
  const { expenses = [], deleteExpense } = useContext(AppDataContext);

  const confirmDelete = (id: number) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const ok = await deleteExpense(id);
          if (!ok) {
            Alert.alert('Error', 'Failed to delete expense');
          }
        },
      },
    ]);
  };

  const renderExpenseItem = ({ item }) => {
    const imageSource = item.receiptUri
      ? { uri: item.receiptUri }
      : item.image_url
      ? { uri: item.image_url }
      : null;

    return (
      <View style={styles.expenseCard}>
        <View style={styles.expenseHeader}>
          {imageSource ? (
            <Image source={imageSource} style={styles.receiptPreview} />
          ) : (
            <View style={[styles.receiptPreview, { backgroundColor: '#EAEAEA' }]} />
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.categoryText}>{item.category || 'Other'}</Text>
            <Text style={styles.merchantText}>{item.merchant || 'Unknown Merchant'}</Text>
            <Text style={styles.codeText}>{item.expenseCode}</Text>
          </View>

          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}
            >
              <Icon name="pencil" size={20} color="#6A0DAD" style={{ marginRight: 10 }} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ExpenseDetails', { expense: item, viewOnly: true })
              }
            >
              <Icon name="eye" size={20} color="#3F51B5" style={{ marginRight: 10 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Icon name="delete-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          <Text style={styles.amountText}>₹{Number(item.amount || 0).toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8E2DE2', '#6A0DAD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Expenses</Text>

        <TouchableOpacity onPress={() => navigation.navigate('ExpenseDetails')}>
          <Icon name="plus" size={26} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={expenses}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderExpenseItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses yet. Add one!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  expenseCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  expenseHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  receiptPreview: { width: 50, height: 50, borderRadius: 6, marginRight: 10 },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  categoryText: { fontSize: 16, fontWeight: '700', color: '#111' },
  merchantText: { fontSize: 13, color: '#777' },
  codeText: { fontSize: 12, color: '#8E2DE2', marginTop: 3 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    paddingTop: 6,
  },
  dateText: { color: '#666', fontSize: 13 },
  amountText: { color: '#6A0DAD', fontWeight: '700', fontSize: 14 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});

export default ExpenseHandlingScreen;
