import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import uploadToS3 from './utils/s3Upload';
import { Buffer } from "buffer";
import analyzeAudio from './utils/audioAnalysis';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [report, setReport] = useState(null);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    const fileData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const buffer = Buffer.from(fileData, 'base64');

    const analysis = analyzeAudio(buffer);
    setReport(analysis);

    const bucket = process.env.AWS_BUCKET;
    if (bucket) {
      const fileName = `practice_${Date.now()}.wav`;
      await uploadToS3(bucket, fileName, buffer, 'audio/wav');
      console.log('Uploaded to S3:', fileName);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KeyKoala Practice Recorder</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {report && (
        <View style={styles.report}>
          <Text>Duration: {report.duration.toFixed(2)}s</Text>
          <Text>Noise Ratio: {(report.noiseRatio * 100).toFixed(1)}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  report: {
    marginTop: 20,
  },
});
