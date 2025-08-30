import React from 'react';
import { Platform } from 'react-native';

// Route wrapper to pick platform-specific implementation
const Impl = Platform.OS === 'web'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ? (require('./forgot.web').default as React.ComponentType)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  : (require('./forgot.native').default as React.ComponentType);

export default function ForgotRoute(props: any) {
  const C = Impl as any;
  return <C {...props} />;
}

