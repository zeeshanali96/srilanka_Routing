import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Video from 'react-native-video';

const VideoPlayer = ({source}) => {
  const {width} = Dimensions.get('window');
  const videoHeight = 200;

  const videoRef = useRef(null);

  const handleEnd = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={source}
        ref={videoRef}
        style={[styles.video, {width, height: videoHeight}]}
        resizeMode="cover"
        onEnd={handleEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default VideoPlayer;
