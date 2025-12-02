import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExpenseScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8E2DE2', '#6A0DAD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Expense</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.text}>Track and manage your expenses easily.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ExpenseHandling')}
        >
          <Text style={styles.buttonText}>Go to Expense Handling</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: {
    color: '#6A0DAD',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#8E2DE2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});

export default ExpenseScreen;
