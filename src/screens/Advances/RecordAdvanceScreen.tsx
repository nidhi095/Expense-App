import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const RecordAdvanceScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [user, setUser] = useState('');
  const [trip, setTrip] = useState('');
  const [paidThrough, setPaidThrough] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8E2DE2', '#6A0DAD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Advances</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Amount (INR)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
          style={styles.input}
          underlineColorAndroid="transparent"
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Text style={styles.input}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selectedDate) => {
              setShowDate(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>User</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user}
            onValueChange={setUser}
            style={styles.picker}
            dropdownIconColor="#6A0DAD"
          >
            <Picker.Item label="Select User" value="" />
          </Picker>
        </View>

        <Text style={styles.label}>Apply to Trip</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={trip}
            onValueChange={setTrip}
            style={styles.picker}
            dropdownIconColor="#6A0DAD"
          >
            <Picker.Item label="Select Trip" value="" />
          </Picker>
        </View>

        <Text style={styles.label}>Paid Through</Text>
        <TextInput
          value={paidThrough}
          onChangeText={setPaidThrough}
          placeholder="Enter payment method"
          style={styles.input}
          underlineColorAndroid="transparent"
        />

        <Text style={styles.label}>Reference Number</Text>
        <TextInput
          value={reference}
          onChangeText={setReference}
          placeholder="Enter reference number"
          style={styles.input}
          underlineColorAndroid="transparent"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes"
          style={styles.input}
          underlineColorAndroid="transparent"
        />

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#6A0DAD', marginTop: 16 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#6A0DAD',
    paddingVertical: 6,
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: '#6A0DAD',
    marginBottom: 8,
  },
  picker: { height: 50, color: '#6A0DAD' },
  submitButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default RecordAdvanceScreen;
