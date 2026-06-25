import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '../../routes/index';
import { QueryProvider } from '../../providers/QueryProvider';
import { LoaderProvider } from '../../context/LoaderContext';
import SplashScreen from './SplashScreen';
import { queryClient } from '../../api/queryClient';
import { prefetchAppData } from '../../api/prefetchAppData';
import { store } from '../../redux/Store';

const AppShell = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const prefetchStarted = useRef(false);

  useEffect(() => {
    if (prefetchStarted.current) {
      return;
    }
    prefetchStarted.current = true;

    const userState = store.getState().user;
    prefetchAppData(queryClient, userState).finally(() => setDataReady(true));
  }, []);

  const finishSplash = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen onFinish={finishSplash} canFinish={dataReady} />;
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
