import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Loading = ({ title }: { title: string }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl mb-3 text-gray-800">{title}</Text>
      <ActivityIndicator size="large" color="#0000ff" />
      <View></View>
    </View>
  );
};

export default Loading;
