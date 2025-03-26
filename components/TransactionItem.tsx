import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import React from "react";
import { Badge } from "./Badge";
import icons from "@/constants/icons";

export const TransactionItem = ({
  monto,
  isAlreadyPaid,
  motivo,
  $createdAt,
  item,
  onPress,
  onLongPress,
}: any) => {
  return (
    <TouchableOpacity
      className="flex-1 flex-row p-3  items-center gap-5"
      onPress={(isAlreadyPaid) => onPress(isAlreadyPaid)}
      onLongPress={(isAlreadyPaid) => onLongPress(isAlreadyPaid)}
    >
      <Text className="flex-1">{motivo}</Text>
      <Text className="flex-1">$ {monto}</Text>

      {isAlreadyPaid == null
        ? Badge({ tipo: "Pendiente", size: "md" })
        : isAlreadyPaid
        ? Badge({ tipo: "Pagado", size: "md" })
        : Badge({ tipo: "Rechazado", size: "md" })}
      <View className="flex-1">
        <Image source={icons.info} className=" h-8 w-8" tintColor={'lightblue'} />
      </View>
    </TouchableOpacity>
  );
};
