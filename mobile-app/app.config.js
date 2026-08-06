require("dotenv").config();

export default {
  expo: {
    name: "HourlyRecruit",
    slug: "hourlyrecruit-mobile",
    version: "1.0.0",
    orientation: "portrait",

    icon: "./assets/icon.png",

    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#F8FAFC"
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hourlyrecruit.mobile"
    },

    android: {
      package: "com.hourlyrecruit.mobile",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#F8FAFC"
      }
    },

    web: {
      favicon: "./assets/favicon.png"
    },

    scheme: "hourlyrecruit",

    plugins: [
      "expo-secure-store",
      "expo-document-picker",
      "expo-image-picker",
      "expo-web-browser",
      "expo-notifications"
    ],

    extra: {
      apiBaseUrl:
        process.env.API_BASE_URL ||
        "https://e-commerce-zvmh.onrender.com/api/v1",

      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId:
        process.env.FIREBASE_MEASUREMENT_ID,

      googleAndroidClientId:
        process.env.GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId:
        process.env.GOOGLE_IOS_CLIENT_ID,
      googleWebClientId:
        process.env.GOOGLE_WEB_CLIENT_ID
    }
  }
};