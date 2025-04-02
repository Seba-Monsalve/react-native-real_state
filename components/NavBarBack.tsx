import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import icons from "@/constants/icons";

export const NavBarBack = ({ children }: { children?: React.ReactNode }) => {
  
  return (
    <View className="flex flex-row items-center gap-4 m-2 p-1 rounded-lg bg-red-100">
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => router.back()}
      >
        <View className="bg-white rounded-full p-2">
          <Image className="size-7" source={icons.backArrow} />
        </View>
      </TouchableOpacity>
      {children}

    </View>
  );
};
