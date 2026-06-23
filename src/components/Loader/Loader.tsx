import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, View } from 'react-native';
import styles from './Styles';

type LoaderProps = {
  visible: boolean;
};

const Loader = ({ visible }: LoaderProps) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!visible) {
      animationRef.current?.stop();
      spinValue.setValue(0);
      return;
    }

    animationRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [visible, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <Animated.Image
            source={require('../../assets/lottie_loader.png')}
            style={[styles.loaderImage, { transform: [{ rotate: spin }] }]}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
