import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';

const ExpenseByCategoryScreen = ({ navigation }: any) => {
  const [selectedRange, setSelectedRange] = useState('Today');

  const ranges = [
    'Today', 'This Week', 'This Month', 'This Quarter', 'This Year',
    'Yesterday', 'Previous Week', 'Previous Month', 'Previous Quarter', 'Previous Year', 'Custom'
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense by Category</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.subTitle}>Select Date Range</Text>

        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            value={selectedRange}
            onValueChange={setSelectedRange}
            items={ranges.map(r => ({ label: r, value: r }))}
            style={{
              inputAndroid: styles.dropdownInput,
              inputIOS: styles.dropdownInput,
            }}
            useNativeAndroidPickerStyle={false}
          />
        </View>

        <TouchableOpacity
          style={styles.runButton}
          onPress={() => navigation.navigate('ExpenseByCategoryReport')}
        >
          <Text style={styles.runText}>Run Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { padding: 20 },
  subTitle: { fontSize: 16, fontWeight: '600', color: '#6A0DAD', marginBottom: 10 },
  dropdownContainer: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, marginBottom: 20 },
  dropdownInput: { padding: 12, fontSize: 16, color: '#333' },
  runButton: { backgroundColor: '#6A0DAD', padding: 14, borderRadius: 8, alignItems: 'center' },
  runText: { color: '#FFF', fontWeight: '700' },
});

export default ExpenseByCategoryScreen;
