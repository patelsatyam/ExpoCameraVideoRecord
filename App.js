import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import TryVideoRecord from './VideoRecord';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TryVideoRecord />
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
