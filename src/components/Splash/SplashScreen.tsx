import { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, View } from 'react-native';
import styles from './Styles';

type SplashScreenProps = {
  onFinish: () => void;
};

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.55)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.6)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(16)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;

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
      Animated.spring(glowScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
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

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    pulseLoop.start();

    Animated.sequence([intro, Animated.delay(120), textIn]).start();

    const exitTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          spinLoop.stop();
          pulseLoop.stop();
          onFinish();
        }
      });
    }, 2400);

    return () => {
      clearTimeout(exitTimer);
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [
    containerOpacity,
    glowScale,
    logoOpacity,
    logoScale,
    onFinish,
    pulseValue,
    spinValue,
    textOpacity,
    textTranslateY,
  ]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
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
          <Animated.Text style={styles.loaderText}>Loading your store…</Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default SplashScreen;
