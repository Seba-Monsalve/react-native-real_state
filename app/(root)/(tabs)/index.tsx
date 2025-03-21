import ActionItem from "@/components/ActionItem";
import { Card } from "@/components/Card";
import Header from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import icons from "@/constants/icons";
import { getCreatedUsers } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-context";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useGlobalContext();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: createdUsers,
    loading: loading,
    refetch,
  } = useAppwrite({
    fn: getCreatedUsers,
    params: { id:user!.$id },
  });


  const handleOnPress = (id: string) => {
    router.push(`/wallets/${id}`);
  };

  return (
    <SafeAreaView className=" bg-[#eee] p-6">
      <Header avatar={user?.avatar!} name={user?.name!} />
      <Text className="text-2xl font-semibold mt-3">Cuentas</Text>
      <Text className="text-2xl font-semibold mt-3">id: {user!.$id}</Text>
      <Text className="text-2xl font-semibold mt-3">name: {user!.name}</Text>
      <View>
        <FlatList
          pagingEnabled
          horizontal
          data={[1]}
          renderItem={({ item }) => (
            <Card onPress={() => handleOnPress(user!.$id)} />
          )}
        />
      </View>
      <View className=" mt-12 bg-white  rounded-lg">
        <View className="flex flex-row justify-around -mt-7 py-2">
          <ActionItem
            icon={icons.person}
            text={"Notificar"}
            onPress={() => {
              router.push("/Request");
            }}
          />
          <ActionItem icon={icons.search} text={"Enviar"} />
          <ActionItem icon={icons.home} text={"Send"} />
        </View>
      </View>

      <View className="flex flex-col justify-around items-center mt-5 gap-3 ">
        <View className="flex flex-row justify-between w-full px-4">

        <Text className="text-2xl font-semibold ">Tus usuarios Creados</Text>
        <Image
          source={icons.add}
          tintColor={"white"}
          className=" w-8 h-8 p-2 bg-green-500 rounded-full"
          />
          </View>
        <FlatList
          data={createdUsers} className="w-full "
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push(`/createdUsers/${item.$id}`);
              }}
            >
              <UserCard {...item} />
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
