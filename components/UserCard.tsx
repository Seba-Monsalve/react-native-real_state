import {
  View,
  Image,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { User } from "@/app/interfaces/user.interface";


export const UserCard = (user: User) => {
  const { name, avatar, email, isActive, $id } = user;

  return (
    <SafeAreaView>
      <View className="flex flex-row mt-2 shadow-l  p-2 rounded-xl bg-white  justify-between items-center overflow-hidden">
        <View className="flex flex-row  ">
          <Image
            className="size-20 rounded-full"
            source={{
              uri:
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
            }}
          />
        </View>
        <View className=" flex flex-row justify-between  items-center gap-3">
          <View>
          <Text className="font-semibold ">{name}</Text>
          </View>
          <Text className="font-semibold p-2 bg-green-500 text-white rounded-xl ">{'al dia'}</Text>
        </View>

            
     
      </View>
    </SafeAreaView>
  );
};
