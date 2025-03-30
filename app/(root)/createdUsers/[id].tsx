import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  createTransaction,
  deleteTransaction,
  updateDebtStatus,
  updateTransaction,
} from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { Badge, Loading, NavBarBack, TransactionItem } from "@/components";
import { useUserStore } from "@/store/user.store";
import { showToast } from "@/app/utils/Toast";

const transaccionFilter = {
  Pagado: "Pagado",
  Pendiente: "Pendiente",
  Rechazado: "Rechazado",
};

const UserDetails = () => {
  const { id: user_id } = useLocalSearchParams();

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((action) => action.updateUser);

  const [filter, setFilter] = useState<null | string>("");
  const [transaction, setTransaction] = useState({
    monto: "",
    motivo: "",
  });

  let timer: number = null;
  const TIMEOUT = 500;

  const debounce = (onSingle, onDouble) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      onDouble();
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
      }, TIMEOUT);
    }
  };

  const onChangeStatus = (id: string) => {
    try {
      const updatedTransactions = user.createdUsers
        ?.find((user) => user.$id === user_id)
        ?.transactions!.map((transaction) => {
          if (transaction.$id == id) {
            const paid = transaction.isAlreadyPaid == true ? null : true;
            // updateTransaction({ id: transaction.$id, isAlreadyPaid: paid });
            return { ...transaction, isAlreadyPaid: paid };
          }
          return transaction;
        });
      const noDebt = !updatedTransactions?.some(
        ({ isAlreadyPaid }) => isAlreadyPaid == false || isAlreadyPaid == null
      );

      // updateDebtStatus({ id: createdUser?.$id, noDebt });

      updateUser({
        ...user,
        createdUsers: user.createdUsers!.map((createdUser) => {
          if (createdUser.$id == user_id) {
            return {
              ...createdUser,
              transactions: updatedTransactions,
              noDebt,
            };
          }
          return createdUser;
        }),
      });

      showToast("Transaccion actualizada");
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Error al actualizar la transaccion",
        ToastAndroid.SHORT
      );
    }
  };

  const onLongPress = (id: string) => {
    Alert.alert("Eliminar ", "Estas seguro de eliminar el registro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteTransaction({ id });
          updateUser({
            ...user,

            createdUsers: user.createdUsers?.map((createdUser) => {
              if (createdUser.$id === user_id) {
                return {
                  ...createdUser,
                  transactions: createdUser?.transactions.filter(
                    (transaction) => transaction.$id !== id
                  ),
                };
              }
              return createdUser;
            }),
          });

          ToastAndroid.show("Transaccion eliminada", ToastAndroid.SHORT);
        },
      },
    ]);
  };

  async function handleOnPress() {
    if (transaction.monto <= 0 || transaction.motivo === "") {
      ToastAndroid.show("Por favor llene todos los campos", ToastAndroid.SHORT);
      return;
    }
    try {
      const createdUser = user.createdUsers?.find(
        (item) => item.$id === user_id
      );
      const newTransaction = await createTransaction({
        monto: transaction.monto,
        motivo: transaction.motivo,
        creditor: user?.$id,
        createdUsers: createdUser?.$id,
        isAlreadyPaid: null,
      });

      if (newTransaction) {
        setTransaction({ monto: "", motivo: "" });

        updateUser({
          ...user,
          createdUsers: user.createdUsers?.map((createdUser) => {
            if (createdUser.$id == user_id) {
              return {
                ...createdUser,
                transactions: createdUser.transactions?.concat({
                  ...newTransaction,
                }),
              };
            }
            return createdUser;
          }),
        });
        updateDebtStatus({ id: createdUser?.$id!, noDebt: false });

        ToastAndroid.show("Transaccion creada", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error al crear la transaccion", ToastAndroid.SHORT);
    }
  }

  return (
    <SafeAreaView className="flex-1 py-5">
      <FlatList
        data={user?.createdUsers
          ?.find((user) => user.$id === user_id)
          ?.transactions?.filter((item) => {
            if (filter == "") return item;
            if (
              item.isAlreadyPaid == null &&
              filter === transaccionFilter.Pendiente
            )
              return item;
            if (
              item.isAlreadyPaid == true &&
              filter === transaccionFilter.Pagado
            )
              return item;
            if (
              item.isAlreadyPaid == false &&
              filter === transaccionFilter.Rechazado
            )
              return item;
          })
          .reverse()}
        renderItem={({ item }) => {
          return (
            <View className="flex flex-row px-3 items-center">
              <TransactionItem
                {...item}
                onPress={() => debounce(null, () => onChangeStatus(item.$id))}
                onLongPress={() => onLongPress(item.$id)}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="flex flex-col justify-center items-center mt-5">
            <Image className="size-64" source={images.noResult} />
            <Text className="text-center mt-5 text-lg font-semibold">
              No hay transactions para este usuario
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <NavBarBack title="Detalles" />
            <HeaderUserDetails
              user={user?.createdUsers?.find(
                (createdUser) => createdUser.$id === user_id
              )}
              transactions={
                user?.createdUsers?.find(
                  (createdUser) => createdUser.$id === user_id
                )?.transactions
              }
            />
            <View className="flex flex-row justify-center items-center px-5 gap-3">
              <TextInput
                className="flex-1 bg-gray-200 p-2 rounded-lg"
                placeholder="Motivo"
                keyboardType="default"
                onChangeText={(value) =>
                  setTransaction({ ...transaction, motivo: value })
                }
                value={transaction.motivo}
              />
              <TextInput
                className="flex-1 bg-gray-200 p-2 rounded-lg"
                placeholder="Monto"
                keyboardType="number-pad"
                onChangeText={(value) =>
                  setTransaction({ ...transaction, monto: +value })
                }
                value={transaction.monto.toString()}
              />
              <TouchableOpacity
                className="p-2 rounded-lg mx-auto  gap-3  flex flex-col items-center justify-center "
                onPress={handleOnPress}
              >
                <Text className="text-md text-white bg-primary-300  p-2 rounded-lg">
                  Agregar
                </Text>
              </TouchableOpacity>
            </View>
            <View className="mt-2">
              <Text className="text-start mx-5 text-sm text-gray-500">
                Filtrar Por:
              </Text>
              <View className="flex flex-row gap-2 items-center justify-center my-2">
                <TouchableOpacity
                  className={`px-2 py-1 rounded-full ${
                    filter === transaccionFilter.Pagado ? "bg-green-200" : ""
                  }`}
                  onPress={() => {
                    if (transaccionFilter.Pagado === filter) {
                      setFilter("");
                      return;
                    }
                    setFilter(transaccionFilter.Pagado);
                  }}
                >
                  <Text>Pagado</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-2 py-1 rounded-full ${
                    filter === transaccionFilter.Pendiente
                      ? "bg-yellow-200"
                      : ""
                  }`}
                  onPress={() => {
                    if (transaccionFilter.Pendiente === filter) {
                      setFilter("");
                      return;
                    }
                    setFilter(transaccionFilter.Pendiente);
                  }}
                >
                  <Text>Pendiente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-2 py-1 rounded-full ${
                    filter === transaccionFilter.Rechazado ? "bg-red-200" : ""
                  }`}
                  onPress={() => {
                    if (transaccionFilter.Rechazado === filter) {
                      setFilter("");
                      return;
                    }
                    setFilter(transaccionFilter.Rechazado);
                  }}
                >
                  <Text>Rechazado</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row mx-7 mt-2 justify-center items-center gap-5">
              <Text className="flex-1 font-semibold text-lg">Razon</Text>
              <Text className="flex-1 font-semibold text-lg">Monto</Text>
              <Text className="flex-2 font-semibold text-lg">Estado</Text>
              <Text className="flex-1 font-semibold text-lg"></Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default UserDetails;

const HeaderUserDetails = ({ user }: any) => {
  if (!user) return <Loading title="Loading..." />;

  return (
    <View className="flex-1   flex-row justify-around items-center p-2 gap-5">
      {/* <Image
        source={{
          uri: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
        }}
        className="size-20 rounded-full"
        resizeMode="contain"
      /> */}
      <View className="flex  flex-1 flex-col items-center gap-2">
        <Text className="text-3xl">{user.name}</Text>

        {user.transactions.some(
          ({ isAlreadyPaid }) => isAlreadyPaid == false || isAlreadyPaid == null
        ) == true ? (
          <Badge tipo="Con deuda" size="lg" />
        ) : (
          <Badge tipo="Al dia" size="lg" />
        )}
      </View>
      <View className="flex  flex-1 flex-col">
        <Text>Nro transactions : {user.transactions.length}</Text>
        <Text className="">
          Pendiente: ${" "}
          {user.transactions
            .filter((item) => !item.isAlreadyPaid)
            .reduce((total, item) => total + item.monto, 0)}
        </Text>
        <Text>
          Pagado: ${" "}
          {user.transactions
            .filter((item) => item.isAlreadyPaid)
            .reduce((total, item) => total + item.monto, 0)}
        </Text>
        <Text className="text-2xl font-semibold">
          Total : ${" "}
          {user.transactions.reduce((total, item) => total + item.monto, 0)}
        </Text>
      </View>
    </View>
  );
};
