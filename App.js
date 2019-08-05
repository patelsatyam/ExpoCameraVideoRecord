import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import TryVideoRecord from './VideoRecord';
import Indicator from './ActivityIndicator';
import CaptureImage from './CaptureImage';
import Swiper from './Components/Swiper';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Swiper />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
