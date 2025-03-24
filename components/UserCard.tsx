import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Badge } from "./Badge";

export const UserCard = ({ name, $id, noDebt }: any) => {
  const handleOnPressCreateUsser = (id: string) => {
    router.push(`/createdUsers/${id}`);
  };

  return (
    <TouchableOpacity
      className="m-2"
      onPress={() => {
        handleOnPressCreateUsser($id);
      }}
    >
      <View className="flex flex-row  w-[100px] shadow-l  p-2 rounded-xl bg-white   ">
        {/* <View className="flex flex-row  ">
          <Image
            className="size-20 rounded-full"
            source={{
              uri:
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
            }}
          />
        </View> */}
        <View className=" flex flex-col justify-center  items-center gap-3 w-full">
          <Text className="font-semibold ">{name}</Text>
          <Badge size="md" tipo={noDebt ? "Al dia" : "Con deuda"} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
