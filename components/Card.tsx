import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import icons from "@/constants/icons";
import { router, useLocalSearchParams } from "expo-router";

interface Props {
  id: any;
  onPress: () => void;
}

export const Card = ({ item, onPress }: any) => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {height, width} = Dimensions.get('window');

  console.log(` w-[${width *1}px]`)


  return (
    <TouchableOpacity
      className={` w-100 mr-3 bg-red-800   rounded-lg p-5 `}
      onPress={() => onPress()}
    >
      <Text className="text-3xl text-gray-200 font-bold ">Personal</Text>
      <View className=" flex flex-col justify-between  mt-5 gap-2">
        <Text className="text-xl text-gray-200"> Por pagar: $2000</Text>
        <Text className="text-xl text-gray-200"> Por recibir: $500</Text>
        <Text className="text-xl text-gray-200"> Total: $500</Text>
      </View>
    </TouchableOpacity>
  );
};
