import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const ActionItem = ({ icon, text, onPress }: any) => {
  return (
    <TouchableOpacity
      className="flex flex-col items-center justify-center"
      onPress={onPress}
    >
      <View className="flex flex-col justify-center items-center rounded-full bg-gray-300 w-12 h-12">
        <Image source={icon} className="size-7" tintColor={"black"} />
      </View>
      <Text className="text-md">{text}</Text>
    </TouchableOpacity>
  );
};

export default ActionItem;
