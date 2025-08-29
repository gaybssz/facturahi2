import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to the login screen for now.
  return <Redirect href="/(auth)/login" />;
}

