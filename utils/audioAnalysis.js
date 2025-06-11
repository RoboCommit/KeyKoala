const wav = require('node-wav');

/**
 * Analyze the audio buffer to detect simple metrics like duration and approximate
 * noise level.
 *
 * @param {Buffer} buffer - WAV audio buffer
 * @returns {{duration: number, noiseRatio: number}}
 */
module.exports = function analyzeAudio(buffer) {
  // parse wav data
  const result = wav.decode(buffer);
  const samples = result.channelData[0];
  const sampleRate = result.sampleRate;
  const duration = samples.length / sampleRate;

  // simple noise detection: ratio of samples below threshold vs above
  let pianoSamples = 0;
  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) > 0.05) pianoSamples++;
  }
  const noiseRatio = 1 - pianoSamples / samples.length;

  return { duration, noiseRatio };
};
