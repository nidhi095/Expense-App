import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdvancesScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Advances</Text>
      <View style={{ width: 26 }} />
    </LinearGradient>

    <View style={styles.content}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecordAdvance')}>
        <Text style={styles.buttonText}>Request Advance</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: '#6A0DAD', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: '600' },
});

export default AdvancesScreen;
