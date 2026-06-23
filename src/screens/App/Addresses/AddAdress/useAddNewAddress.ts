import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../../../redux/Hooks';
import { saveStoreId, saveUser } from '../../../../redux/auth/AuthSlice';
import {
  useAddAddressMutation,
  useStoreLookupMutation,
} from '../../../../api/hooks';
import type { AddAddressBody } from '../../../../api/types';

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceDetails = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
};

const pickComponent = (
  components: GoogleAddressComponent[] | undefined,
  type: string
): GoogleAddressComponent | undefined => {
  return components?.find((c) => c.types?.includes(type));
};

const isPlaceInScotland = (
  details: GooglePlaceDetails,
  components: GoogleAddressComponent[] | undefined
): boolean => {
  if (/,(\s*)Scotland(\s*,|\s*$)/i.test(details.formatted_address ?? '')) {
    return true;
  }
  for (const c of components ?? []) {
    const isAdmin =
      c.types?.includes('administrative_area_level_1') ||
      c.types?.includes('administrative_area_level_2');
    if (isAdmin && /^scotland$/i.test(c.long_name.trim())) {
      return true;
    }
  }
  const admin1 =
    pickComponent(components, 'administrative_area_level_1')?.long_name ?? '';
  if (/^scotland$/i.test(admin1.trim())) {
    return true;
  }
  const postcode =
    pickComponent(components, 'postal_code')?.long_name?.trim() ?? '';
  if (!postcode) {
    return false;
  }
  const outward =
    postcode.replace(/\s+/g, ' ').trim().toUpperCase().split(' ')[0] ?? '';
  if (!outward) {
    return false;
  }
  const two = outward.slice(0, 2);
  const scottishTwoLetter = new Set([
    'AB',
    'DD',
    'DG',
    'EH',
    'FK',
    'HS',
    'KA',
    'KY',
    'ML',
    'TD',
    'ZE',
  ]);
  if (scottishTwoLetter.has(two)) {
    return true;
  }
  if (/^G\d/.test(outward)) {
    return true;
  }
  if (/^IV/i.test(outward)) {
    return true;
  }
  if (/^KW/i.test(outward)) {
    return true;
  }
  if (/^PA\d/i.test(outward) || /^PA$/i.test(outward)) {
    return true;
  }
  if (/^PH\d/i.test(outward) || /^PH$/i.test(outward)) {
    return true;
  }
  return false;
};

const useAddNewAddress = () => {
  const navigation = useNavigation<any>();

  const user = useAppSelector((state: any) => state.user.value);
  const token = useAppSelector((state: any) => state.user.token);
  const dispatch = useAppDispatch();

  const addAddressMutation = useAddAddressMutation();
  const storeLookupMutation = useStoreLookupMutation();

  const [isEnabled, setIsEnabled] = useState(false);
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [town, setTown] = useState('');
  const [passcode, setPasscode] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const ValidateFields = () => {
    if (fname === '') {
      Alert.alert('Please enter first name');
      return false;
    }
    if (lname === '') {
      Alert.alert('Please enter last name');
      return false;
    }
    if (address1 === '') {
      Alert.alert('Please enter steet 1');
      return false;
    }
    if (town === '') {
      Alert.alert('Please enter town');
      return false;
    }
    if (phone === '') {
      Alert.alert('Please enter phone number');
      return false;
    }
    return true;
  };

  const onPlaceSelected = (details: GooglePlaceDetails | null) => {
    if (!details) return;

    const components = details.address_components;

    if (!isPlaceInScotland(details, components)) {
      Alert.alert(
        'Scotland only',
        'Please choose an address in Scotland. Addresses in England, Wales, or Northern Ireland are not accepted.'
      );
      return;
    }

    const sublocality =
      pickComponent(components, 'sublocality')?.long_name ??
      pickComponent(components, 'sublocality_level_1')?.long_name ??
      '';

    const postalTown =
      pickComponent(components, 'postal_town')?.long_name ??
      pickComponent(components, 'locality')?.long_name ??
      '';

    const postalCode =
      pickComponent(components, 'postal_code')?.long_name ?? '';

    setAddress1(details.formatted_address || '');
    if (sublocality) setAddress2(sublocality);
    if (postalTown) setTown(postalTown);
    if (postalCode) setPostcode(postalCode);
  };

  const addressBody: AddAddressBody = useMemo(
    () => ({
      userId: user?.userData?.id,
      firstName: fname,
      lastName: lname,
      street1: address1,
      street2: address2,
      town,
      postalCode: postcode,
      phone,
      isDefaultAddress: isEnabled,
    }),
    [
      user?.userData?.id,
      fname,
      lname,
      address1,
      address2,
      town,
      postcode,
      phone,
      isEnabled,
    ]
  );

  const SaveAddress = async () => {
    if (!ValidateFields()) {
      Alert.alert('Please fill all the fields');
      return;
    }

    storeLookupMutation.mutate(
      { zip: postcode, token },
      {
        onSuccess: (storeResponse) => {
          if (!storeResponse.status) {
            Alert.alert(
              'Sorry',
              'We are not in your area. We have noted, and we will be there soon.'
            );
            return;
          }

          addAddressMutation.mutate(
            { token, body: addressBody },
            {
              onSuccess: (addingNewAddressResponse) => {
                const data = {
                  isLoggedIn: true,
                  userData: {
                    ...user.userData,
                    user_address: addingNewAddressResponse.data,
                  },
                };
                dispatch(saveUser(data));
                dispatch(saveStoreId(storeResponse.data));
                navigation.pop();
              },
              onError: (error) => {
                console.log('error', error);
              },
            }
          );
        },
        onError: () => {
          Alert.alert(
            'Sorry',
            'We are not in your area. We have noted, and we will be there soon.'
          );
        },
      }
    );
  };

  return {
    loading: addAddressMutation.isPending || storeLookupMutation.isPending,
    isEnabled,
    fname,
    lname,
    address1,
    address2,
    town,
    passcode,
    phone,
    setFName,
    setLName,
    setAddress1,
    setAddress2,
    setTown,
    setPasscode,
    setPhone,
    toggleSwitch,
    SaveAddress,
    onPlaceSelected,
    postcode,
    setPostcode,
  };
};

export default useAddNewAddress;
