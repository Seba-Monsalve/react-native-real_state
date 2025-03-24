interface Props {
  tipo: "Con deuda" | "Pagado" | "Pendiente" | "Al dia" | "Rechazado";
  size: "xl" | "lg" | "md" | "sm";
}

const style = {
  "Con deuda": "bg-red-200",
  Rechazado: "bg-red-200",
  Pagado: "bg-green-200",
  Pendiente: "bg-yellow-300",
  "Al dia": "bg-green-200",
};

const sizes = {
  xl: "text-xl",
  lg: "text-lg px-2 py-1 ",
  md: "text-md px-2 py-1",
  sm: "text-sm",
};
import { View, Text } from "react-native";
import React from "react";

export const Badge = ({ tipo, size }: Props) => {
  return (
    <View className={`${style[tipo]} rounded-xl w-fit-content`}>
      <Text className={`${sizes[size]} rounded-xl `}>{tipo}</Text>
    </View>
  );
};
