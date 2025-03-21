import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import icons from "@/constants/icons";

const NavBarBack = ({ title = "" }: { title?: string }) => {
  return (
    <View className="flex flex-row items-center gap-4 m-2">
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => router.back()}
      >
        <View className="bg-white rounded-full p-2">
          <Image className="size-7" source={icons.backArrow} />
        </View>
      </TouchableOpacity>
      <Text className="text-2xl">{title}</Text>
    </View>
  );
};

export default NavBarBack;
