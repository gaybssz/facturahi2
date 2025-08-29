import React from 'react';
import { Platform } from 'react-native';

// Expo Router requires a fallback (non-platform) route file.
// This wrapper picks the platform-specific implementation.
const Impl = Platform.OS === 'web'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ? (require('./login.web').default as React.ComponentType)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  : (require('./login.native').default as React.ComponentType);

export default function LoginRoute(props: any) {
  const C = Impl as any;
  return <C {...props} />;
}

