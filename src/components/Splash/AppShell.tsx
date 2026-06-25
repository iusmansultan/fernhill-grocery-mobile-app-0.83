import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '../../routes/index';
import { QueryProvider } from '../../providers/QueryProvider';
import { LoaderProvider } from '../../context/LoaderContext';
import SplashScreen from './SplashScreen';

const AppShell = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryProvider>
      <LoaderProvider>
        <SafeAreaProvider>
          <Router />
        </SafeAreaProvider>
      </LoaderProvider>
    </QueryProvider>
  );
};

export default AppShell;
