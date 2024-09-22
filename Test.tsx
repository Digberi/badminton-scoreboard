import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, NativeEventEmitter, NativeModules } from 'react-native';

const { WearOSModule } = NativeModules;

alert(WearOSModule);
console.log(WearOSModule);

export const Test: React.FC = () => {
  const [watchScore, setWatchScore] = useState<number>(0);

  useEffect(() => {
    const scoreEventEmitter = new NativeEventEmitter(WearOSModule);


    const subscription = scoreEventEmitter.addListener('scoreUpdated', (event) => {
      setWatchScore(event.score);  // Update score state when new score is received
    });

    return () => {
      subscription.remove();  // Clean up the listener when component unmounts
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Score: {watchScore}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
