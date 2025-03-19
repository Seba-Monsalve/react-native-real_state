import { View, Image, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { Transaction } from "@/app/interfaces/transaction.interface";

const ListItem = ({
  monto,
  paid_by,
  $createdAt,
  isAlreadyPaid,
}: Transaction) => {
  return (
    <TouchableOpacity

    className="flex flex-row mt-2 shadow-lg   justify-between items-center"
    >
      <View className="flex flex-row  ">
        <Image
          className="size-20"
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
          }}
        />
        <View className=" flex flex-col gap-1s justify-center items-center ml-2">
          <Text className="font-semibold">{paid_by.name}</Text>
          <Text className="text-gray-500">{$createdAt.substring(0, 10)}</Text>
        </View>
      </View>
      {isAlreadyPaid ? (
        <Text className=" px-2 py-1  bg-green-200 rounded-xl">Pagado</Text>
      ) : (
        <Text className=" px-2 py-1  bg-yellow-300 rounded-xl">Pendiente</Text>
      )}

      <Text className=" font-semibold text-xl">${monto}</Text>
    </TouchableOpacity>
  );
};

export default ListItem;
