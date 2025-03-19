import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import ListItem from "@/components/ListItem";
import icons from "@/constants/icons";
import NavBarBack from "@/components/NavBarBack";
import { useAppwrite } from "@/lib/useAppwrite";
import { getTransactionById } from "@/lib/appwrite";
import Loading from "@/components/Loading";

const Wallet = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { data, loading } = useAppwrite({
    fn: getTransactionById,
    params: { id: id! },
  });
  if (loading) return <Loading title='Loading'/>;

  const documentos = data?.documents || [];
  const sumValues = documentos.reduce((total, item) => total + item.monto, 0);
  return (
    <View className="flex-1 mt-5 px-3 mx-2">
      <View className="flex flex-row items-center justify-between ">
        <NavBarBack />
        <Text className="text-3xl font-semibold text-gray-800">Summary</Text>
        <View className="bg-white rounded-full p-2">
          <Image source={icons.info} className="size-7" />
        </View>
      </View>
      <View className=" mt-5">
        <Text className="text-xl text-gray-600">Total:</Text>
        <Text className="text-5xl text-gray-800 mt-5">$ {sumValues}</Text>
      </View>
      <View className="flex-1 px-2">
        <Text className="text-2xl mt-5 font-semibold mb-2">
          Transactions: ({data!.total}){" "}
        </Text>
        <FlatList
          data={data?.documents}
          contentContainerStyle={{ paddingBottom: 30, marginTop: 5 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ListItem {...item} />}
          keyExtractor={(item, index) => item.$id}
        />
      </View>
    </View>
  );
};

export default Wallet;
