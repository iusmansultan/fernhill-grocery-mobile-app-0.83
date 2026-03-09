import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAppDispatch, useAppSelector } from "../../../../redux/Hooks";
import { saveUser } from "../../../../redux/auth/AuthSlice";
import { AddUserAddress } from "../../../../helpers/Backend";

type RootStateLike = any;

type AddressBody = {
  userId: string | number;
  firstName: string;
  lastName: string;
  street1: string;
  street2: string;
  town: string;
  postalCode: string;
  phone: string;
  isDefaultAddress: boolean;
};

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

const useAddNewAddress = () => {
  const navigation = useNavigation<any>();

  const user = useAppSelector((state: RootStateLike) => state.user.value);
  const token = useAppSelector((state: RootStateLike) => state.user.token);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [town, setTown] = useState("");
  const [passcode, setPasscode] = useState("");
  const [phone, setPhone] = useState("");

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const ValidateFields = () => {
    if (fname === "") {
      Alert.alert("Please enter first name");
      return false;
    }
    if (lname === "") {
      Alert.alert("Please enter last name");
      return false;
    }
    if (address1 === "") {
      Alert.alert("Please enter steet 1");
      return false;
    }
    // if (address2 === "") {
    //   Alert.alert("Please enter steet 2");
    //   return false;
    // }
    if (town === "") {
      Alert.alert("Please enter town");
      return false;
    }
    if (passcode === "") {
      Alert.alert("Please enter postal code");
      return false;
    }
    if (phone === "") {
      Alert.alert("Please enter phone number");
      return false;
    }
    return true;
  };

  const onPlaceSelected = (details: GooglePlaceDetails | null) => {
    if (!details) return;
    console.log ("DEtails", details)

    const components = details.address_components;

    const sublocality =
      pickComponent(components, "sublocality")?.long_name ??
      pickComponent(components, "sublocality_level_1")?.long_name ??
      "";

    const postalTown =
      pickComponent(components, "postal_town")?.long_name ??
      pickComponent(components, "locality")?.long_name ??
      "";

    const postalCode = pickComponent(components, "postal_code")?.long_name ?? "";

    setAddress1(details.formatted_address || "");
    if (sublocality) setAddress2(sublocality);
    if (postalTown) setTown(postalTown);
    if (postalCode) setPasscode(postalCode);
  };

  const addressBody: AddressBody = useMemo(
    () => ({
      userId: user?.userData?.id,
      firstName: fname,
      lastName: lname,
      street1: address1,
      street2: address2,
      town: town,
      postalCode: passcode,
      phone: phone,
      isDefaultAddress: isEnabled,
    }),
    [
      user?.userData?.id,
      fname,
      lname,
      address1,
      address2,
      town,
      passcode,
      phone,
      isEnabled,
    ]
  );

  const SaveAddress = () => {
    const val = ValidateFields();

    if (!val) {
      Alert.alert("Please fill all the fields");
      return;
    }

    setLoading(true);
    AddUserAddress(token, addressBody)
      .then((res: any) => {
        const data = {
          isLoggedIn: true,
          userData: {
            ...user.userData,
            user_address: res.data,
          },
        };
        dispatch(saveUser(data));
        setLoading(false);
        navigation.pop();
      })
      .catch((err: unknown) => {
        console.log(err);
        setLoading(false);
      });
  };

  return {
    loading,
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
  };
};

export default useAddNewAddress;
