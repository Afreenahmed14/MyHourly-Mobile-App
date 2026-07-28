import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login-choice" />
      <Stack.Screen name="login-candidate" />
      <Stack.Screen name="login-company" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
