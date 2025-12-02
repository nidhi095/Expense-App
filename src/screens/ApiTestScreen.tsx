// src/screens/ApiTestScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const ApiTestScreen = () => {
  const [data, setData] = useState('Loading...');

  useEffect(() => {
    // === IMPORTANT: replace 192.168.1.6 with your laptop's IPv4 address ===
    // Example: 'http://192.168.1.6:5000/api/hello'
    axios
      .get('http://192.168.1.40:5000/api/hello')
      .then(res => setData(res?.data?.message ?? 'No message in response'))
      .catch(err => {
        console.log('API Error:', err?.message ?? err);
        setData('Error fetching data');
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#333' },
});

export default ApiTestScreen;
