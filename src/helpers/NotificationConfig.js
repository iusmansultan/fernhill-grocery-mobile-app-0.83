// import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function requestUserPermission() {
  // // const dispatch = useDispatch();
  // const authStatus = await messaging().requestPermission();
  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // if (enabled) {
  //   console.log('Authorization status:', authStatus);
  //   getFcmToken();
  // }
}
const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'old fcm token');

  // if (!fcmToken) {
  //   try {
  //     // fcmToken = await messaging().getToken();
  //     // if (fcmToken) {
  //     //   // user has a device token
  //     //   console.log(fcmToken, 'new fcm token');
  //     //   await AsyncStorage.setItem('fcmToken', fcmToken);
  //     // }
  //   } catch (error) {
  //     console.log(error, 'err in fcm tokemn');
  //   }
  // }
  // if (fcmToken) {
  //   return fcmToken;
  // }
};
const notificationListener = async () => {
  // messaging().onNotificationOpenedApp(async remoteMessage => {
  //   console.log(
  //     'Notification caused app to open from background state:',
  //     remoteMessage.notification,
  //   );
  // });
  // messaging().onMessage(async remoteMessage => {
  //   console.log('Message data recieve in foreground:', remoteMessage);
  // });
  // messaging()
  //   .getInitialNotification()
  //   .then(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log(
  //         'Notification caused app to open from quit state:',
  //         remoteMessage.notification,
  //       );
  //     }
  //   });
};
export {requestUserPermission, getFcmToken, notificationListener};
