import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View style={styles.container}>
    <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Analytics</Text>
      <View style={{ width: 26 }} />
    </LinearGradient>


    <View style={styles.content}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ExpenseByCategory')}
      >
        <Icon name="chart-pie" size={36} color="#6A0DAD" />
        <Text style={styles.cardText}>Expense by Category</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ExpenseByMerchant')}
      >
        <Icon name="store" size={36} color="#6A0DAD" />
        <Text style={styles.cardText}>Expense by Merchant</Text>
      </TouchableOpacity>
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  content: { padding: 20 },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
  },
  cardText: { marginTop: 8, fontSize: 16, color: '#6A0DAD', fontWeight: '600' },
});


export default AnalyticsScreen;
