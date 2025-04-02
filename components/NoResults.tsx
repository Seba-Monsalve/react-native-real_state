import { View, Image, Text } from "react-native";
import React from "react";
import images from "@/constants/images";

export const NoResults = () => {
  return (
    <View className=" flex-1 flex items-center my-5">
      <Image
        source={images.noResult}
        className="size-64 "
        resizeMode="contain"
      />
      <Text className="text-2xl font-rubik-bold tebl300 mt-5">Sin resultados </Text>
      <Text className=" text-base bal100 mt-2">
        No hay resultados
      </Text>
    </View>
  );
};
