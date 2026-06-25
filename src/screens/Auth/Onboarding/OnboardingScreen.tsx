import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './Styles';
import { ONBOARDING_SLIDES } from './onboardingData';
import {
  isOnboardingComplete,
  setOnboardingComplete,
} from '../../../utils/onboardingStorage';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const completed = await isOnboardingComplete();
      if (completed) {
        (navigation as any).replace('PostcodeCheck');
        return;
      }
      setReady(true);
    };

    bootstrap();
  }, [navigation]);

  const finishOnboarding = useCallback(async () => {
    await setOnboardingComplete();
    (navigation as any).replace('PostcodeCheck');
  }, [navigation]);

  const goToNext = useCallback(() => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      return;
    }
    finishOnboarding();
  }, [activeIndex, finishOnboarding]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderSlide = ({
    item,
    index,
  }: {
    item: (typeof ONBOARDING_SLIDES)[number];
    index: number;
  }) => {
    const isLast = index === ONBOARDING_SLIDES.length - 1;

    return (
      <View style={styles.slide}>
        <ImageBackground
          source={item.image}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay} />
        </ImageBackground>

        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.85)', '#FFFFFF']}
          style={styles.gradient}
        />

        <View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((slide, dotIndex) => (
              <View
                key={slide.id}
                style={[styles.dot, dotIndex === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.quote}>{item.quote}</Text>

          <View style={styles.footer}>
            {!isLast ? (
              <>
                <TouchableOpacity style={styles.skipButton} onPress={finishOnboarding}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
                  <Icon name="arrow-right" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={finishOnboarding}
                activeOpacity={0.9}
              >
                <View style={styles.getStartedIconWrap}>
                  <Icon name="shopping" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.getStartedText}>Get Started</Text>
                <Icon name="arrow-right" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!ready) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

export default OnboardingScreen;
