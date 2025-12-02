// src/screens/expense/ExpenseDetailsScreen.tsx
import React, { useContext, useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';

import { AppDataContext } from '../../context/AppDataContext';
import { expenseSchema, ExpenseFormData } from '../../validation/validationSchemas';

const ExpenseDetailsScreen = ({ navigation, route }) => {
  const { addExpense, updateExpense } = useContext(AppDataContext);
  const editingExpense = route.params?.expense;
  const viewOnly = route.params?.viewOnly || false;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    mode: 'onSubmit',
  });

  const initialImage =
    editingExpense?.receiptUri || editingExpense?.image_url || null;

  const [receiptUri, setReceiptUri] = useState<string | null>(initialImage);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (editingExpense) {
        reset({
          name: editingExpense.name || '',
          merchant: editingExpense.merchant || '',
          category: editingExpense.category || '',
          otherCategory: '',
          amount: editingExpense.amount?.toString() || '',
          date: editingExpense.date || '',
          reimburse: editingExpense.reimburse || false,
        });
        setReceiptUri(editingExpense.receiptUri || editingExpense.image_url || null);
      } else {
        reset({
          name: '',
          merchant: '',
          category: '',
          otherCategory: '',
          amount: '',
          date: '',
          reimburse: false,
        });
        setReceiptUri(null);
      }
    }, [reset, editingExpense])
  );

  const autoDetectCategory = (text: string) => {
    const t = text.toUpperCase();

    const categories = [
      { cat: 'Fuel', keys: ['FUEL', 'PETROL', 'DIESEL', 'HP', 'IOCL', 'BPCL'] },
      { cat: 'Meals', keys: ['FOOD', 'RESTAURANT', 'CAFE', 'HOTEL', 'MEAL', 'KITCHEN'] },
      { cat: 'Air Travel', keys: ['AIRPORT', 'FLIGHT', 'INDIGO', 'AIR INDIA', 'BOARDING'] },
      { cat: 'Automobile', keys: ['SERVICE', 'TYRE', 'WHEEL', 'AUTOCARE'] },
      { cat: 'IT', keys: ['LAPTOP', 'MOUSE', 'KEYBOARD', 'ELECTRONICS', 'GADGET'] },
      { cat: 'Personal', keys: ['GROCERY', 'SUPERMARKET', 'MART', 'DMART'] },
    ];

    for (const c of categories) {
      if (c.keys.some((k) => t.includes(k))) return c.cat;
    }
    return '';
  };

  const extractNumbers = (txt: string) => {
    const matches = [...txt.matchAll(/([0-9]{1,3}(?:[,][0-9]{3})*(?:\.[0-9]{1,2})|[0-9]+\.\d{1,2})/g)];
    return matches.map((m) => m[1].replace(/,/g, ''));
  };

  const pickImage = async () => {
    if (viewOnly) return;

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (!result.didCancel && result.assets?.length > 0) {
      const uri = result.assets[0].uri as string;
      setReceiptUri(uri);

      try {
        const ocr = await TextRecognition.recognize(uri);

        let fullText = '';
        if (typeof ocr === 'string') fullText = ocr.toUpperCase();
        else if (Array.isArray(ocr)) fullText = ocr.join('\n').toUpperCase();
        else if (ocr?.text) fullText = ocr.text.toUpperCase();

        const lines = fullText.split('\n').map((l) => l.trim()).filter(Boolean);

        const shopKeywords = ['DMART', 'MART', 'STORE', 'SUPERMARKET', 'BAZAAR', 'MEGA', 'HYPER', 'SHOP'];

        let merchant =
          lines.find((l) => shopKeywords.some((k) => l.includes(k))) ||
          lines.find((l) => /^[A-Z\s]{3,}$/.test(l) && l.length < 26) ||
          lines[0] ||
          '';

        setValue('merchant', merchant.substring(0, 25));

        let amount = '';

        const totalKeywords = [
          'GRAND TOTAL',
          'TOTAL AMOUNT',
          'NET AMOUNT',
          'NET TOTAL',
          'AMOUNT PAYABLE',
          'BILL AMOUNT',
          'AMOUNT DUE',
          'BALANCE DUE',
          'TOTAL AMT',
          'TOTAL:',
          'TOTAL ',
        ];

        const ignoreKeywords = ['GST', 'CGST', 'SGST', 'HSN', 'TAX', 'QTY', 'DISC'];

        for (let i = lines.length - 1; i >= 0 && !amount; i--) {
          const line = lines[i];
          if (!line) continue;

          if (ignoreKeywords.some((k) => line.includes(k))) continue;

          if (totalKeywords.some((k) => line.includes(k))) {
            const nums = extractNumbers(line);
            if (nums.length > 0) {
              amount = nums[nums.length - 1];
              break;
            }

            const nextLine = lines[i + 1] || '';
            const nextNums = extractNumbers(nextLine);
            if (nextNums.length > 0) {
              amount = nextNums[nextNums.length - 1];
              break;
            }
          }
        }

        if (!amount) {
          for (let i = lines.length - 1; i >= 0 && !amount; i--) {
            if (lines[i].includes('TOTAL')) {
              const localNums = extractNumbers(lines[i]);
              if (localNums.length > 0) {
                amount = localNums[localNums.length - 1];
                break;
              }
            }
          }
        }

        if (!amount) {
          const all = extractNumbers(fullText).map((s) => ({
            raw: s,
            num: parseFloat(s),
          }));

          const filtered = all.filter((o) => !isNaN(o.num) && o.num > 10);

          if (filtered.length > 0) {
            const max = filtered.reduce((a, b) => (b.num > a.num ? b : a), filtered[0]);
            amount = max.raw;
          }
        }

        if (amount) setValue('amount', amount.replace(/,/g, ''));

        let dateMatch =
          fullText.match(/\b(\d{4}[\/-]\d{2}[\/-]\d{2})\b/) ||
          fullText.match(/\b(\d{2}[\/-]\d{2}[\/-]\d{4})\b/);

        if (dateMatch) {
          let date = dateMatch[1].replace(/\//g, '-');
          if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
            const [d, m, y] = date.split('-');
            date = `${y}-${m}-${d}`;
          }
          setValue('date', date);
        }

        const autoCat = autoDetectCategory(fullText);
        if (autoCat) setValue('category', autoCat);

        Alert.alert('OCR Complete', 'Bill details auto-filled!');
      } catch (err) {
        console.log('OCR ERROR:', err);
        Alert.alert('OCR Failed', 'Could not read bill.');
      }
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    const expenseData = {
      name: data.name,
      merchant: data.merchant || '',
      category: data.category === 'Others' ? data.otherCategory : data.category,
      amount: data.amount,
      date: data.date,
      reimburse: data.reimburse || false,
      receiptUri,
    };

    let ok = false;

    if (editingExpense) {
      ok = await updateExpense(editingExpense.id, expenseData);
    } else {
      ok = await addExpense(expenseData);
    }

    if (ok) {
      Alert.alert('Success', editingExpense ? 'Expense updated successfully' : 'Expense added successfully');
      navigation.navigate('ExpenseHandling');
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const imageSource = receiptUri ? { uri: receiptUri } : null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {viewOnly ? 'View Expense' : editingExpense ? 'Edit Expense' : 'Add Expense'}
        </Text>

        {!viewOnly && (
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Text style={styles.saveText}>SAVE</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              editable={!viewOnly}
              style={styles.lineInput}
              placeholder="Enter name"
              placeholderTextColor="#B8A8DA"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Expense Date</Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <TextInput
              editable={!viewOnly}
              style={styles.lineInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#B8A8DA"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Merchant</Text>
        <Controller
          control={control}
          name="merchant"
          render={({ field: { onChange, value } }) => (
            <TextInput
              editable={!viewOnly}
              style={styles.lineInput}
              placeholder="Merchant name"
              placeholderTextColor="#B8A8DA"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Attach Bill</Text>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={pickImage}
          disabled={viewOnly}
        >
          <Icon name="file-image" size={22} color="#6A0DAD" />
          <Text style={styles.attachText}>{viewOnly ? 'View Bill' : 'Browse Bill'}</Text>
        </TouchableOpacity>

        {imageSource && (
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image
              source={imageSource}
              style={{ width: 150, height: 150, borderRadius: 10, marginTop: 10 }}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Category</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerBox}>
              <Picker selectedValue={value} onValueChange={onChange} enabled={!viewOnly}>
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Air Travel" value="Air Travel" />
                <Picker.Item label="Automobile" value="Automobile" />
                <Picker.Item label="IT" value="IT" />
                <Picker.Item label="Fuel" value="Fuel" />
                <Picker.Item label="Meals" value="Meals" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
          )}
        />

        <Text style={styles.label}>Amount</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <View style={styles.amountRow}>
              <Text style={styles.currency}>INR</Text>
              <TextInput
                editable={!viewOnly}
                style={[styles.lineInput, { flex: 1, borderBottomWidth: 0 }]}
                placeholder="0.00"
                placeholderTextColor="#B8A8DA"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Reimburse</Text>
          <Controller
            control={control}
            name="reimburse"
            render={({ field: { value } }) => (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{value ? 'Yes' : 'No'}</Text>
                <Switch
                  disabled={viewOnly}
                  value={value || false}
                  onValueChange={(val) => setValue('reimburse', val)}
                  thumbColor={value ? '#6A0DAD' : '#ccc'}
                  trackColor={{ true: '#D3B5FF', false: '#EAE2F8' }}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>

      <Modal visible={imageModalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Icon name="close" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.modalContainer}>
            {imageSource && <Image source={imageSource} style={styles.modalImage} />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  saveText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#6A0DAD', fontWeight: '600', marginTop: 16 },
  lineInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#C8B5EC',
    paddingVertical: 6,
    color: '#333',
  },
  attachButton: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  attachText: { color: '#6A0DAD', fontWeight: '600', marginLeft: 4 },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#E2D4FA',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  amountRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  currency: { color: '#6A0DAD', fontWeight: '600', marginRight: 8 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { color: '#6A0DAD', fontWeight: '600', marginRight: 8 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 30,
  },
  modalContainer: { padding: 20 },
  modalImage: { width: 320, height: 480, borderRadius: 10, resizeMode: 'contain' },
});

export default ExpenseDetailsScreen;
