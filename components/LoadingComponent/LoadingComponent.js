import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Surface, Text } from 'react-native-paper';

const LoadingComponent = () => {
  return (
    <Surface style={styles.container}>
      <ActivityIndicator animating={true} size="large" />
      <Text style={styles.text}>Loading...</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default LoadingComponent;
