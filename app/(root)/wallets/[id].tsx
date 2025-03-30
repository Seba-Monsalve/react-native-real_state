import { View, Text, Image, FlatList,  } from "react-native";
import React from "react";
import {  useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import {Loading, NavBarBack,ListItem} from "@/components/";

const Wallet = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();


  return (
    <View className="flex-1 mt-5 px-3 mx-2">
      <View className="flex flex-row items-center justify-between ">
        <NavBarBack />
        <Text className="text-3xl font-semibold text-gray-800">Summary {id}</Text>
        <View className="bg-white rounded-full p-2">
          <Image source={icons.info} className="size-7" />
        </View>
      </View>

      <View className=" mt-5">
        <Text className="text-xl text-gray-600">Total:</Text>
      </View>

      <View className="flex-1 px-2 mt-5">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl  font-semibold mb-2">
          </Text>
        </View>
        
      </View>
    </View>
  );
};

export default Wallet;
