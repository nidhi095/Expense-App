import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppDataContext } from '../context/AppDataContext';

const AccountScreen = ({ navigation }) => {
  const { currentUser, logoutUser } = useContext(AppDataContext);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => await logoutUser(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account</Text>
      <View style={styles.profileBox}>
        <Text style={styles.name}>{currentUser?.name || 'Guest User'}</Text>
        <Text style={styles.email}>{currentUser?.email || '-'}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('AccountDetails')} style={styles.btnWrapper}>
        <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.btn}>
          <Text style={styles.btnText}>Go to Details</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.btnWrapper, { marginTop: 20 }]}>
        <LinearGradient colors={['#E53935', '#B71C1C']} style={styles.btn}>
          <Text style={styles.btnText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', padding: 20 },
  header: { fontSize: 26, fontWeight: '700', color: '#6A0DAD', marginBottom: 30 },
  profileBox: { backgroundColor: '#F3E8FF', padding: 20, borderRadius: 12, alignItems: 'center', width: '100%', marginBottom: 30 },
  name: { fontSize: 20, fontWeight: '700', color: '#333' },
  email: { fontSize: 15, color: '#666', marginTop: 6 },
  btnWrapper: { width: '100%', borderRadius: 30, overflow: 'hidden' },
  btn: { paddingVertical: 14, alignItems: 'center', borderRadius: 30 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default AccountScreen;
