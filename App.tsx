/**
 * @format
 * @flow strict-local
 * @author <iusmansultan>
 */

import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import Router from './src/routes/index';
import {store} from './src/redux/Store';
import {QueryProvider} from './src/providers/QueryProvider';
import {
  notificationListener,
  requestUserPermission,
} from './src/helpers/NotificationConfig';

let persistor = persistStore(store);

const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <Router />
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
