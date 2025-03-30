import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export const WalletCard = ({ item, title, onPress }: any) => {
  const totals = item.reduce(
    (acc, item) => {
      if (item.isAlreadyPaid == true) {
        acc.paid += item.monto; // Sumar a los montos pagados
      } else if (item.isAlreadyPaid === null) {
        acc.debt += item.monto; // Sumar a los montos no pagados
      }
      return acc;
    },
    { paid: 0, debt: 0, pending: 0 } // Valores iniciales
  );
  const { paid, debt } = totals;
  const total = paid + debt;
  return (
    <TouchableOpacity
      className={`w-100 mr-3 bg-primary-300 rounded-lg p-4 `}
      onPress={() => onPress()}
    >
      <Text className="text-3xl text-gray-200 font-bold ">{title}</Text>
      <View className=" flex flex-col justify-between  mt-2 gap-2">
        <View className="flex flex-col">
          <Text className="text-sm text-gray-200">Pagado:</Text>
          <Text className=" text-gray-200 text-lg font-semibold">
            $ {paid} ({((paid / total) * 100.0).toFixed(2)}%)
          </Text>
        </View>
        <View className="flex flex-col">
          <Text className="text-sm text-gray-200">Pendiente:</Text>
          <Text className=" text-gray-200 text-lg font-semibold">
            $ {debt} ({((debt / total) * 100.0).toFixed(2)}%)
          </Text>
        </View>

        <View className="p-2  bg-accent-100 rounded-lg">
          <Text className="text-sm text-gray-600 "> Total: </Text>
          <Text className="text-2xl text-gray-600 font-semibold  ">
            $ {(+debt + paid).toLocaleString("es-CL")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
