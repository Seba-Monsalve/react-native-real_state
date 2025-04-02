import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import React from "react";
import { Badge } from "./Badge";

export const TransactionItem = ({
  monto,
  isAlreadyPaid,
  motivo,
  onPress,
  onLongPress,
}: any) => {
  return (
    <TouchableOpacity
      className="flex-1 flex-row px-3  items-center mt-2 "
      onPress={(isAlreadyPaid) => onPress(isAlreadyPaid)}
      onLongPress={(isAlreadyPaid) => onLongPress(isAlreadyPaid)}
    >
      <Text className="flex-1 text-sm line-clamp-1">{motivo}</Text>
      <Text className="flex-1 line-clamp-1">$ {monto}</Text>

      {isAlreadyPaid == null
        ? Badge({ tipo: "Pendiente", size: "md" })
        : isAlreadyPaid
        ? Badge({ tipo: "Pagado", size: "md" })
        : Badge({ tipo: "Rechazado", size: "md" })}
      {/* <View className="flex-1">
        <Image source={icons.info} className=" h-8 w-8" tintColor={'lightblue'} />
      </View> */}
    </TouchableOpacity>
  );
};
