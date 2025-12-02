import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CardsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Cards section coming soon</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5FF' },
  text: { color: '#6A0DAD', fontSize: 18, fontWeight: '600' },
});

export default CardsScreen;
