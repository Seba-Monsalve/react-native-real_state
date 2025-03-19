import { View, Text, Image } from "react-native";
import React from "react";
import icons from "@/constants/icons";

const Header = ({ avatar, name }: { avatar: string; name: string }) => {
  return (
    <View className=" flex flex-row justify-between items-center">
      <View className=" flex flex-row items-center">
        <Image source={{ uri: avatar }} className="size-12 rounded-full" />
        <View className="flex flex-col items-start ml-2 justify-center">
          <Text className="text-xs font-rubik text-black-100">
            Good Morning
          </Text>
          <Text className=" font-rubik-medium text-black-300 text-base">
            {name}
          </Text>
        </View>
      </View>
        <Image source={icons.shield} className="size-10" tintColor={"red"} />
    </View>
  );
};

export default Header;
