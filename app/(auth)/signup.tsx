import React from 'react';
import { Platform } from 'react-native';

// Expo Router requires a fallback (non-platform) route file.
// This wrapper picks the platform-specific implementation.
const Impl = Platform.OS === 'web'
  ? (require('./signup.web').default as React.ComponentType)
  : (require('./signup.native').default as React.ComponentType);

export default function SignupRoute(props: any) {
  const C = Impl as any;
  return <C {...props} />;
}

