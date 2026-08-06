import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Button } from 'react-native-paper';
import { auth } from '../api/firebase';

WebBrowser.maybeCompleteAuthSession();

/**
 * Native equivalent of the web app's "Continue with Google" button
 * (components/auth/FirebaseAuthButtons.jsx), which uses
 * firebase/auth signInWithPopup. Native has no popup, so this uses
 * expo-auth-session to get a Google credential, then signs into the *same*
 * Firebase project with it — the resulting Firebase ID token is handed to
 * the backend exactly like the web flow (POST /auth/:role/firebase).
 *
 * Requires Google OAuth client IDs (from Google Cloud Console, matching
 * the Firebase project) set in app.config.js -> extra.
 */
export default function GoogleSignInButton({ onToken, disabled, style }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
    webClientId: Constants.expoConfig?.extra?.googleWebClientId,
  });

  useEffect(() => {
    const handle = async () => {
      if (response?.type !== 'success') return;
      const { id_token: googleIdToken } = response.params;
      const credential = GoogleAuthProvider.credential(googleIdToken);
      const result = await signInWithCredential(auth, credential);
      const firebaseIdToken = await result.user.getIdToken();
      onToken(firebaseIdToken);
    };
    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <Button
      mode="outlined"
      icon="google"
      disabled={disabled || !request}
      onPress={() => promptAsync()}
      style={style}
    >
      Continue with Google
    </Button>
  );
}
