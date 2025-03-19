import {
  View,
  Image,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { User } from "@/app/interfaces/user.interface";

type Action = {
  type: "pagar" | "cobrar" | null;
  amount: number;
  reason: string;
  user: User | null;
};

export const UserItem = (user: User) => {
  const { name, avatar, email, isActive, $id } = user;
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setaction] = useState<Action>({
    type: null,
    amount: 0,
    reason: "",
    user: null,
  });

  return (
    <SafeAreaView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          className="opacity-90 bg-red-700 flex-1 justify-center items-center relative"
          onPress={() => {
            setModalVisible(!modalVisible);
            setaction({ type: null, amount: 0, reason: "", user: null });
          }}
        >
          <View className="bg-white p-20 rounded-xl shadow-lg gap-4  flex items-center justify-center absolute ">
            <Text className="text-2xl">Confirmar Pago</Text>
            <Text>{action.user?.name}</Text>
            <View className="flex flex-row  justify-center items-center gap-2 mt-5">
              <Text>Monto:</Text>
              <TextInput
                onChangeText={(value) =>
                  setaction((prev) => ({ ...prev, amount: +value }))
                }
                placeholder=""
                keyboardType="numeric"
                className="text-sm bg-gray-300  w-1/2 "
              />
            </View>
            <View className="flex flex-row  justify-center items-center gap-2">
              <Text>Razon:</Text>
              <TextInput
                onChangeText={(value) =>
                  setaction((prev) => ({ ...prev, reason: value }))
                }
                placeholder=""
                className="text-sm bg-gray-300  w-1/2 "
              />
            </View>
            <View className="flex flex-row gap-4  w-full justify-center items-center">
              <Pressable
                className="bg-green-400 p-2 rounded-xl font-semibold  justify-center items-center"
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setaction({ ...action, type: "pagar" });
                }}
              >
                <Text className="p-1 font-semibold ">Confirmar</Text>
              </Pressable>
              <Pressable
                className="bg-red-400 p-2 rounded-xl font-semibold  justify-center items-center"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="p-1 font-semibold ">Cancelar</Text>
              </Pressable>
            </View>
          </View>


        </TouchableOpacity>
      </Modal>

      <View className="flex flex-row mt-2 shadow-l  p-2 rounded-xl bg-white  justify-between items-center overflow-hidden">
        <View className="flex flex-row  ">
          <Image
            className="size-20 rounded-full"
            source={{
              uri:
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
            }}
          />
        </View>

        <View className=" flex flex-col gap-1 justify-center  text-start items-start ml-2 overflow-clip">
          <Text className="font-semibold ">{name}</Text>
        </View>
        <View className="flex flex-row gap-2 ">
          <Pressable
            className="bg-green-300 p-2 rounded-xl font-semibold  justify-center items-center"
            onPress={() => {
              setModalVisible(!modalVisible);
              setaction({ ...action, type: "pagar" });
            }}
          >
            <Text className=" font-semibold">Pagar</Text>
          </Pressable>
          <Pressable
            className="bg-blue-300 p-2 rounded-xl font-semibold  justify-center items-center"
            onPress={() => {
              setModalVisible(!modalVisible);
              setaction({ ...action, type: "cobrar" });
            }}
          >
            <Text className=" font-semibold">Cobrar</Text>
          </Pressable>
        </View>
      </View>
      <Text>{JSON.stringify(action)}</Text>
    </SafeAreaView>
  );
};
