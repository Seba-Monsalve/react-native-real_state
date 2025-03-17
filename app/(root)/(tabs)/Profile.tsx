import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import React from "react";
import { useGlobalContext } from "@/lib/global-context";
import { logout } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { settings } from "@/constants/data";

interface SettingItemProps {
  title: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  textStyle: any;
  showArrow?: boolean;
}

const SettingItem = ({
  title,
  icon,
  onPress,
  textStyle,
  showArrow = true,
}: any) => {
  return (
    <TouchableOpacity className="w-full h-16" onPress={onPress}>
      <View className="flex flex-row items-center justify-between w-full h-full px-2 border-b border-gray-200">
        <View className=" flex flex-row items-center gap-4">
          <Image source={icon} className="size-8" />
          <Text
            className={`text-xl font-rubik-medium text-gray-700 ${textStyle}`}
          >
            {title}
          </Text>
        </View>
        {showArrow && <Image source={icons.rightArrow} className="size-6" />}
      </View>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const { refetch, user } = useGlobalContext();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Logged out successfully");
      refetch();
    } else Alert.alert("Error", "An error occured while logging out");
  };

  return (
    <SafeAreaView className=" h-full ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7 "
      >
        <View className="flex flex-row w-full items-center justify-between px-2 mt-6 gap-4">
          <Text className="text-3xl font-rubik-medium">Profile</Text>
          <Image source={icons.bell} className="size-8" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={user?.avatar ? { uri: user.avatar } : images.avatar}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity className=" absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>
            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>
        <View className=" flex flex-col mt-3">
          <SettingItem icon={icons.calendar} title="My bookings" showArrow />
          <SettingItem icon={icons.wallet} title="Payments" showArrow />
        </View>
        <View className="border-t border-gray-400 pt-3 flex flex-col">
          {settings.slice(2).map((item, index) => (
            <SettingItem {...item} key={index} />
          ))}
        </View>
        <View className="border-t border-gray-400 pt-3 flex  items-center justify-center">
          <SettingItem
            icon={icons.logout}
            title="Logout"
            onPress={handleLogout}
            textStyle="items-center  text-red-600 text-center"
            showArrow={false}
          ></SettingItem>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
