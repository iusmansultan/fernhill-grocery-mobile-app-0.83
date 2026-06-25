import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#1946A9',
  white: '#FFFFFF',
  text: '#111827',
  muted: '#4B5563',
  overlay: 'rgba(255, 255, 255, 0.92)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slide: {
    width,
    height,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.55,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 38,
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.muted,
    marginBottom: 28,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  skipButton: {
    paddingVertical: 12,
    paddingRight: 12,
  },
  skipText: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: '500',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  getStartedIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  getStartedText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },
  getStartedChevrons: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 16,
    letterSpacing: -2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default styles;
