import { View, Image, Text, ScrollView, FlatList } from "react-native";
import React from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import { getTransactionById, getUserById } from "@/lib/appwrite";
import Loading from "@/components/Loading";
import { useLocalSearchParams } from "expo-router";
import TransactionItem from "@/components/TransactionItem";
import NavBarBack from "@/components/NavBarBack";

const UserDetails = () => {
  const { id } = useLocalSearchParams();
  const {
    data: user,
    loading,
    error,
  } = useAppwrite({
    fn: getUserById,
    params: { id: id.toString() },
  });

  if (loading) return <Loading title="Loading..." />;

  const { name, avatar } = user;
  console.log(JSON.stringify(user!.transacciones));

  console.log({ user });
  return (
    <ScrollView className="flex-1 py-5 ">
      <NavBarBack title="Detalles" />
      <View className=" flex flex-row justify-center items-center p-2 gap-5">
        <Image
          source={{
            uri: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
          }}
          className="size-20 rounded-full"
          resizeMode="contain"
        />

        <View className="flex flex-col items-center gap-2">
          <Text className="text-3xl">{name}</Text>
          <Text className="text-2xl bg-green-300 text-center rounded-lg p-1">
            Al dia
          </Text>
        </View>
        <View className="flex flex-col">
          <Text>Nro Transacciones : {user?.transacciones.length}</Text>
          <Text>Pendiente : {user?.transacciones.length}</Text>
          <Text>Pagado : {user?.transacciones.length}</Text>
          <Text className="text-2xl font-semibold">
            Total : ${" "}
            {user?.transacciones.reduce((total, item) => total + item.monto, 0)}
          </Text>
        </View>
      </View>
      <Text>FILTROS</Text>

      <FlatList
        className=" flex gap-2 px-3 flex-1 "
        data={user?.transacciones}
        renderItem={({ item }) => (
          // <Text>{JSON.stringify(user?.transacciones)}</Text>
          <TransactionItem {...item} />
        )}

        ListHeaderComponent={
          <View className="flex-1 justify-around flex-row gap-2 p-2 bg-gray-200">
            <Text>Motivo</Text>
            <Text>Monto</Text>
            <Text>Creado </Text>
            <Text>Estado</Text>
          </View>
        }
      />
    </ScrollView>
  );
};

export default UserDetails;


