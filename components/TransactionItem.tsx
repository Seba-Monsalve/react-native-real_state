import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import {Badge} from "./Badge";

export const TransactionItem = ({monto, isAlreadyPaid, motivo, $createdAt,item,onPress,onLongPress}: any) => {
  
  return (
    <TouchableOpacity
      className="flex-1 flex-row p-3  items-center"
      onPress={(isAlreadyPaid) => onPress(isAlreadyPaid)}
      onLongPress={(isAlreadyPaid) => onLongPress(isAlreadyPaid)}
    >
      <Text className="flex-1">{motivo}</Text>
      <Text className="flex-1">$ {monto}</Text>
      <Text className="flex-1">{$createdAt.substring(0, 10)}</Text>

      {isAlreadyPaid == null
        ? Badge({ tipo: "Pendiente", size: "md" })
        : isAlreadyPaid
        ? Badge({ tipo: "Pagado", size: "md" })
        : Badge({ tipo: "Rechazado", size: "md" })}
    </TouchableOpacity>
  );
};
