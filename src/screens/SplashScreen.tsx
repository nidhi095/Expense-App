import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#8E2DE2', '#6A0DAD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar backgroundColor="#6A0DAD" barStyle="light-content" />
      <View style={styles.centerContent}>
        <View style={styles.logoRow}>
          <Image
            source={require('../assets/splashscreenlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Codestellar</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -height * 0.05,
  },
  logoRow: {
    flexDirection: 'row',        // 👈 places logo + text side by side
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 12,             // spacing between logo and text
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Poppins-SemiBold', // optional font
  },
});

export default SplashScreen;
