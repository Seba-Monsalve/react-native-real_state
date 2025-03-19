import ActionItem from "@/components/ActionItem";
import { Card } from "@/components/Card";
import Header from "@/components/Header";
import icons from "@/constants/icons";
import {  getProperties } from "@/lib/appwrite";
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
    data: users,
    loading: loadingsers,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: { query: params.query!, filter: params.filter!, limit: 2 },
    skip: true,
  });

  useEffect(() => {
    refetch({ query: params.query!, filter: params.filter!, limit: 6 });
  }, [params.filter, params.query]);

  const handleOnPress = (id: string) => {
    router.push(`/wallets/${id}`);
  };

  return (
    <SafeAreaView className=" bg-[#eee] p-6">
      <Header avatar={user?.avatar!} name={user?.name!} />
      <Text className="text-2xl font-semibold mt-3">Cuentas</Text>
      <View>
        <FlatList
          pagingEnabled
          horizontal
          data={[1, ]}
          renderItem={({ item }) => (
            <Card onPress={() => handleOnPress(user!.$id)} />
          )}
        />
      </View>
      <View className="flex flex-row justify-around mt-5">
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
    </SafeAreaView>
  );
}
