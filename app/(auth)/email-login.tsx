import React from 'react';
import { Platform } from 'react-native';

export default function EmailLoginRoute(props: any) {
  if (Platform.OS === 'web') {
    const { Redirect } = require('expo-router');
    return <Redirect href="/(auth)/login" />;
  }
  const Impl = require('./email-login.native').default as React.ComponentType<any>;
  const C = Impl as any;
  return <C {...props} />;
}

