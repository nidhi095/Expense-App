import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PersonalScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Personal Screen</Text>

    <TouchableOpacity
      onPress={() => navigation.navigate('PersonalDetails')} // Navigate within PersonalStack
      style={styles.buttonWrapper}
    >
      <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.gradientButton}>
        <Text style={styles.buttonText}>Go to Details</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  text: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#333' },
  buttonWrapper: { borderRadius: 30, overflow: 'hidden' },
  gradientButton: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30, elevation: 4, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default PersonalScreen;
