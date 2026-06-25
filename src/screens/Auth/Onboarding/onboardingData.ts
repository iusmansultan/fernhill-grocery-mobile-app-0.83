import { ImageSourcePropType } from 'react-native';

export type OnboardingSlide = {
  id: string;
  title: string;
  quote: string;
  image: ImageSourcePropType;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Fernhill Grocers',
    quote:
      'Your trusted local grocer in Glasgow — fresh produce, everyday essentials, and friendly service since day one.',
    image: require('../../../assets/slides/slide_1.jpg'),
  },
  {
    id: '2',
    title: 'Fresh Picks, Great Value',
    quote:
      '"Eat well, live well." Browse deals, save favourites, and enjoy 10% off your first order and 5% off your second.',
    image: require('../../../assets/slides/slide_2.jpg'),
  },
  {
    id: '3',
    title: 'Delivered to Your Door',
    quote:
      'Order in minutes, track every step, and get groceries delivered or ready for pickup — simple, fast, and convenient.',
    image: require('../../../assets/slides/slide_3.jpg'),
  },
];
