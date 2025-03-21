import { View, Text } from "react-native";
import React from "react";

const TransactionItem = ({ monto, isAlreadyPaid, item, $createdAt }: any) => {
  return (
    <View className="flex flex-row items-center justify-between p-2 bg-red-300 " >
      <Text className="w-15">{item}</Text>
      <Text className="w-15">$ {monto}</Text>
      <Text className="w-15">{$createdAt.substring(0, 10)}</Text>
      {isAlreadyPaid ? (
        <Text className="w-15 p-2 bg-green-200 rounded-lg">Pagado</Text>
      ) : (
        <Text className="w-15 p-2 bg-yellow-200 rounded-lg">Pendiente</Text>
      )}
    </View>
  );
};

export default TransactionItem;
