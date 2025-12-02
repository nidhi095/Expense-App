import React, { useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from '@react-navigation/native';
import { AppDataContext } from '../../context/AppDataContext';
import { tripSchema, TripFormData } from '../../validation/validationSchemas';

const CreateTripScreen = ({ navigation }) => {
  const { addTrip } = useContext(AppDataContext);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    mode: 'onSubmit',
    defaultValues: {
      travelType: 'Domestic',
    },
  });

  const travelType = watch('travelType');

  // ✅ Clear form when screen opens
  useFocusEffect(
    useCallback(() => {
      reset({
        tripName: '',
        purpose: '',
        travelType: 'Domestic',
      });
    }, [reset])
  );

  const onSubmit = (data: TripFormData) => {
    addTrip({
      name: data.tripName,
      purpose: data.purpose || '',
      travelType: data.travelType,
      createdAt: new Date().toISOString().split('T')[0],
    });
    Alert.alert('Trip Created', 'Trip added successfully!');
    navigation.goBack();
  };

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
        <Text style={styles.headerTitle}>New Trip</Text>
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Travel Type</Text>
        <View style={styles.typeRow}>
          {['Domestic', 'International'].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.typeOption}
              onPress={() => setValue('travelType', type)}
            >
              <View style={styles.bulletOuter}>
                {travelType === type && <View style={styles.bulletInner} />}
              </View>
              <Text style={styles.typeText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Trip Name</Text>
        <Controller
          control={control}
          name="tripName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter trip name"
              style={styles.input}
              placeholderTextColor="#B8A8DA"
            />
          )}
        />
        {errors.tripName && <Text style={styles.errorText}>{errors.tripName.message}</Text>}

        <Text style={styles.label}>Purpose</Text>
        <Controller
          control={control}
          name="purpose"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter purpose"
              style={styles.input}
              placeholderTextColor="#B8A8DA"
            />
          )}
        />
        {errors.purpose && <Text style={styles.errorText}>{errors.purpose.message}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitText}>Create Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// styles unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  form: { padding: 20 },
  label: { color: '#6A0DAD', fontWeight: '600', marginTop: 16 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  typeOption: { flexDirection: 'row', alignItems: 'center' },
  bulletOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#6A0DAD',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  bulletInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6A0DAD' },
  typeText: { color: '#333', fontSize: 15 },
  input: {
    backgroundColor: '#FFF', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#DDD', fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#6A0DAD', marginTop: 24,
    paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
});

export default CreateTripScreen;
