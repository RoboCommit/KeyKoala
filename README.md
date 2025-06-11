# KeyKoala
🐾 KeyKoala – A fun and friendly app that helps kids stay on track with their piano practice through smart monitoring and playful encouragement.

## Development Setup

This project uses [Expo](https://expo.dev) for easy React Native development.

```bash
npm install
npm start # starts the Expo dev server
```

The app requests microphone permissions, records audio, analyzes the recording for duration and noise ratio, and uploads the WAV file to an AWS S3 bucket (if `AWS_BUCKET` environment variable is set). Configure AWS credentials via the standard environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`.

## Usage

1. Press **Start Recording** to begin tracking a practice session.
2. When finished, press **Stop Recording**. A simple report with the session duration and estimated noise ratio will appear.
3. If AWS credentials and bucket are configured, the audio file is uploaded to S3.

This is a minimal prototype and can be extended with richer analysis (such as pitch detection or piece recognition) in the future.
