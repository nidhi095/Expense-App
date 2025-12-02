// src/screens/AddMenuScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;
const AddMenuScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <Text style={styles.headerTitle}>Create</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      <View style={styles.center}>
        <View style={styles.dropUp}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('ExpenseHandling')}
          >
            <Icon name="file-document-plus-outline" size={22} color="#6A0DAD" />
            <Text style={styles.rowText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Icon name="airplane-takeoff" size={22} color="#6A0DAD" />
            <Text style={styles.rowText}>Create Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('NewReport')}
          >
            <Icon name="file-chart-outline" size={22} color="#6A0DAD" />
            <Text style={styles.rowText}>New Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: { paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'flex-end' },
  dropUp: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: Platform.select({ ios: 20, android: 14 }),
    paddingHorizontal: 12,
    marginBottom: 28,
    elevation: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowText: { marginLeft: 14, color: '#6A0DAD', fontSize: 16, fontWeight: '600' },
});

export default AddMenuScreen;
