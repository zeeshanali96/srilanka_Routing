import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import * as Progress from 'react-native-progress';

import constants from '../../src/constants';

export default function LoadingSchedule({
  videoSource,
  buttonTitle,
  navigationTarget,
  scheduledata,
  setLoadingForSchedule,
}) {
  const navigation = useNavigation();
  const [progress, setProgress] = React.useState(0);
  const [indeterminate, setIndeterminate] = React.useState(true);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const barWidth = Dimensions.get('screen').width;

  useEffect(() => {
    let interval;

    const startProgress = () => {
      setIndeterminate(false);
      interval = setInterval(() => {
        setProgress(prevProgress => {
          const nextProgress = prevProgress + 0.05;
          if (nextProgress >= 1) {
            clearInterval(interval);
            setButtonDisabled(false);
            return 1;
          }
          return nextProgress;
        });
      }, 1000);
    };

    const timer = setTimeout(() => {
      startProgress();
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const handleClick = () => {
    navigation.navigate(navigationTarget, {scheduledata});
    setLoadingForSchedule(false);
  };

  return (
    <View style={styles.container}>
      <View className="mt-1">
        <Progress.Bar
          style={styles.progress}
          progress={progress}
          indeterminate={indeterminate}
          width={barWidth}
          height={2}
          borderRadius={0}
          color={constants.colors.blue}
        />
      </View>
      <View className="justify-center flex-1">
        <VideoPlayer source={videoSource} />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => handleClick()}
          disabled={buttonDisabled}>
          {buttonTitle}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  progress: {
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
});
