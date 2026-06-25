import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, View } from 'react-native';
import styles from './Styles';

const MIN_SPLASH_MS = 2400;
const MAX_SPLASH_MS = 6000;

type SplashScreenProps = {
  onFinish: () => void;
  canFinish?: boolean;
};

const SplashScreen = ({ onFinish, canFinish = true }: SplashScreenProps) => {
  const finishedRef = useRef(false);
  const minTimeDoneRef = useRef(false);
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.55)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(16)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  const runExit = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;

    Animated.timing(containerOpacity, {
      toValue: 0,
      duration: 380,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });
  }, [containerOpacity, onFinish]);

  const tryExit = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    if (minTimeDoneRef.current && canFinish) {
      runExit();
    }
  }, [canFinish, runExit]);

  useEffect(() => {
    const intro = Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const textIn = Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const spinLoop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinLoop.start();
    Animated.sequence([intro, Animated.delay(120), textIn]).start();

    const minTimer = setTimeout(() => {
      minTimeDoneRef.current = true;
      tryExit();
    }, MIN_SPLASH_MS);

    const maxTimer = setTimeout(runExit, MAX_SPLASH_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      spinLoop.stop();
    };
  }, [
    logoOpacity,
    logoScale,
    runExit,
    spinValue,
    textOpacity,
    textTranslateY,
    tryExit,
  ]);

  useEffect(() => {
    tryExit();
  }, [tryExit]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1946A9" />
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.Image
          source={require('../../assets/logoW.png')}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textTranslateY }],
          alignItems: 'center',
        }}
      >
        <Animated.Text style={styles.title}>Fernhill Grocers</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Fresh groceries delivered to your door
        </Animated.Text>
        <View style={styles.loaderRow}>
          <Animated.Image
            source={require('../../assets/lottie_loader.png')}
            style={[styles.loaderImage, { transform: [{ rotate: spin }] }]}
          />
          <Animated.Text style={styles.loaderText}>
            {canFinish ? 'Almost ready…' : 'Loading your store…'}
          </Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default SplashScreen;
