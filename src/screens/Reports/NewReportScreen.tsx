import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema, ReportFormData } from '../../validation/validationSchemas';
import { AppDataContext } from '../../context/AppDataContext';
import { useFocusEffect } from '@react-navigation/native';

const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const NewReportScreen = ({ navigation, route }: any) => {
  const { addReport, updateReport, reports, trips = [] } = useContext(AppDataContext);

  const editId = route.params?.editId || null;
  const isEditMode = !!editId;
  const existingReport = isEditMode ? reports.find((r) => r.id === editId) : null;

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [associateModalVisible, setAssociateModalVisible] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(
    existingReport?.tripId || null
  );
  const [nextCode, setNextCode] = useState<string>('');

  // ✅ Dynamically show next report code based on current reports
  useFocusEffect(
    useCallback(() => {
      if (!reports || reports.length === 0) {
        setNextCode('#00001');
        return;
      }

      const numbers = reports
        .map((r) => parseInt(r.reportCode?.replace('#', '') || '0'))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const next = numbers.length + 1;
      setNextCode(`#${next.toString().padStart(5, '0')}`);
    }, [reports])
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: 'onSubmit',
    defaultValues: {
      fromDate: existingReport ? new Date(existingReport.fromDate) : new Date(),
      toDate: existingReport ? new Date(existingReport.toDate) : new Date(),
      reportName: existingReport?.reportName || '',
      purpose: existingReport?.purpose || '',
    },
  });

  const fromDate = watch('fromDate');
  const toDate = watch('toDate');

  useEffect(() => {
    if (isEditMode && existingReport) {
      reset({
        reportName: existingReport.reportName,
        purpose: existingReport.purpose || '',
        fromDate: new Date(existingReport.fromDate),
        toDate: new Date(existingReport.toDate),
      });
      setSelectedTripId(existingReport.tripId || null);
    }
  }, [isEditMode]);

  const onSubmit = async (data: ReportFormData) => {
    if (data.toDate < data.fromDate) {
      Alert.alert('Error', 'To Date cannot be earlier than From Date');
      return;
    }

    if (isEditMode && existingReport) {
      updateReport(editId, {
        ...existingReport,
        reportName: data.reportName,
        purpose: data.purpose,
        fromDate: new Date(data.fromDate).toISOString(),
        toDate: new Date(data.toDate).toISOString(),
        tripId: selectedTripId || undefined,
      });
      Alert.alert('Updated', 'Report updated successfully!');
    } else {
      const newReport = {
        reportName: data.reportName,
        purpose: data.purpose || '',
        fromDate: new Date(data.fromDate).toISOString(),
        toDate: new Date(data.toDate).toISOString(),
        tripId: selectedTripId || undefined,
      };
      await addReport(newReport);
      Alert.alert('Created', 'New report created successfully!');
    }

    reset({
      reportName: '',
      purpose: '',
      fromDate: new Date(),
      toDate: new Date(),
    });
    setSelectedTripId(null);
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
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Report' : 'New Report'}
        </Text>
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveBtn}>{isEditMode ? 'UPDATE' : 'SAVE'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Report Name</Text>
        <Controller
          control={control}
          name="reportName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter report name"
              style={styles.input}
              placeholderTextColor="#B8A8DA"
            />
          )}
        />
        {errors.reportName && (
          <Text style={styles.errorText}>{errors.reportName.message}</Text>
        )}

        {/* Show the next predicted code (UX only) */}
        {!isEditMode && (
          <>
            <Text style={[styles.label, { marginTop: 12 }]}>Next Report Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{nextCode || '#-----'}</Text>
            </View>
          </>
        )}

        <Text style={styles.label}>Duration</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setShowFrom(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>From: {formatDate(new Date(fromDate))}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTo(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>To: {formatDate(new Date(toDate))}</Text>
          </TouchableOpacity>
        </View>

        {showFrom && (
          <DateTimePicker
            value={new Date(fromDate)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              setShowFrom(false);
              if (date) setValue('fromDate', date);
            }}
          />
        )}
        {showTo && (
          <DateTimePicker
            value={new Date(toDate)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              setShowTo(false);
              if (date) setValue('toDate', date);
            }}
          />
        )}

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

        <Text style={styles.label}>Associate with Trip</Text>
        <TouchableOpacity
          style={styles.tripSelect}
          onPress={() => setAssociateModalVisible(true)}
        >
          <Text style={styles.tripText}>
            {selectedTripId
              ? trips.find((t) => t.id === selectedTripId)?.name ?? 'Selected trip'
              : 'Select Trip'}
          </Text>
          <Icon name="chevron-down" size={22} color="#6A0DAD" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitText}>
            {isEditMode ? 'Update Report' : 'Create Report'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trip selection modal */}
      <Modal visible={associateModalVisible} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.panel}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Select Trip</Text>
              <TouchableOpacity onPress={() => setAssociateModalVisible(false)}>
                <Icon name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {(!trips || trips.length === 0) ? (
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#666' }}>No trips available. Create a trip first.</Text>
              </View>
            ) : (
              <FlatList
                data={trips}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={modalStyles.tripRow}
                    onPress={() => {
                      setSelectedTripId(item.id);
                      setAssociateModalVisible(false);
                    }}
                  >
                    <Text style={modalStyles.tripName}>{item.name}</Text>
                    <Text style={modalStyles.tripMeta}>
                      {item.travelType} • {item.createdAt}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#333' },
  tripRow: { padding: 14, borderBottomWidth: 1, borderColor: '#F2F2F2' },
  tripName: { fontSize: 15, color: '#6A0DAD', fontWeight: '600' },
  tripMeta: { color: '#777', marginTop: 4 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  saveBtn: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#6A0DAD', marginTop: 16 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#6A0DAD',
    paddingVertical: 6,
    color: '#333',
    marginBottom: 8,
  },
  codeBox: {
    backgroundColor: '#EFE6FF',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  codeText: { color: '#6A0DAD', fontWeight: '700', fontSize: 15 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  dateButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
  },
  dateText: { color: '#6A0DAD', fontWeight: '500' },
  tripSelect: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  tripText: { color: '#6A0DAD', fontWeight: '500' },
  submitButton: {
    backgroundColor: '#6A0DAD',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
});

export default NewReportScreen;
