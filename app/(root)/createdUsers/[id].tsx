import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, {  useState } from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import {
  createTransaction,
  getUserById,
} from "@/lib/appwrite";
import Loading from "@/components/Loading";
import { useLocalSearchParams } from "expo-router";
import TransactionItem from "@/components/TransactionItem";
import NavBarBack from "@/components/NavBarBack";
import { SafeAreaView } from "react-native-safe-area-context";
import Badge from "@/components/Badge";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-context";

const transaccionFilter = {
  Pagado: "Pagado",
  Pendiente: "Pendiente",
  Rechazado: "Rechazado",
};

const UserDetails = () => {
  const { id } = useLocalSearchParams();
  const { user } = useGlobalContext();

  const { data: createdUser, loading } = useAppwrite({
    fn: getUserById,
    params: { id: id.toString() },
  });

  const [filter, setFilter] = useState<null | string>("");
  const [transaction, settransaction] = useState({
    monto: 0,
    motivo: "",
  });

  if (loading) return <Loading title="Loading..." />;

  async function handleOnPress() {
    if (transaction.monto <= 0 || transaction.motivo === "") {
      ToastAndroid.show("Por favor llene todos los campos", ToastAndroid.SHORT);
      return;
    }
    const newTransaction = await createTransaction({
      monto: transaction.monto,
      id_receiver: "aasd",
      motivo: transaction.motivo,
      paid_by: user?.$id,
      createdUsers: createdUser?.$id,
    });

    if (newTransaction) {
      ToastAndroid.show("Transaccion creada", ToastAndroid.SHORT);
      settransaction({ monto: 0, motivo: "" });
      createdUser?.transacciones.push(newTransaction);
    } else {
      ToastAndroid.show("Error al crear la transaccion", ToastAndroid.SHORT);
    }
  }

  return (
    <SafeAreaView className="flex-1 py-5 ">
      <FlatList
        data={createdUser?.transacciones
          .filter((item) => {
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
        renderItem={({ item }) => (
          <View className=" flex flex-row px-3  items-center">
            <TransactionItem {...item} />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex flex-col justify-center items-center mt-5">
            <Image className="size-64" source={images.noResult} />
            <Text className=" text-center mt-5 text-lg font-semibold ">
              No hay transacciones para este usuario
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <NavBarBack title="Detalles" />
            <HeaderUserDetails user={createdUser} />
            <View className="flex flex-row justify-center items-center px-5 gap-3 ">
                  <TextInput
                    className="flex-1 bg-gray-200 p-2 rounded-lg "
                    placeholder="Motivo"
                    keyboardType="default"
                    onChangeText={(value) =>
                      settransaction({ ...transaction, motivo: value })
                    }
                    value={transaction.motivo}
                  />
                  <TextInput
                    className="flex-1 bg-gray-200 p-2 rounded-lg "
                    placeholder="Monto"
                    keyboardType="number-pad"
                    onChangeText={(value) =>
                      settransaction({ ...transaction, monto: +value })
                    }
                    value={transaction.monto.toString()}
                  />
                  <TouchableOpacity
                    className=" p-2 rounded-lg mx-auto  mt-2 gap-3"
                    onPress={handleOnPress}
                  >
                    <Image
                      source={icons.add}
                      tintColor={"white"}
                      className="size-8 bg-green-500 rounded-full p-2"
                    />
                  </TouchableOpacity>
                </View>
            {createdUser?.transacciones.length > 0 && (
              <>
             
                <View className="">
                  <Text className=" text-start mx-5 text-sm text-gray-500">
                    Filtrar Por:
                  </Text>
                  <View className="flex flex-row gap-2 items-center justify-center mb-2">
                    <TouchableOpacity
                      className={`px-2 py-1  rounded-full ${
                        filter === transaccionFilter.Pagado
                          ? "bg-green-200"
                          : ""
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
                      className={`px-2 py-1  rounded-full ${
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
                      className={`px-2 py-1  rounded-full ${
                        filter === transaccionFilter.Rechazado
                          ? "bg-red-200"
                          : ""
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

                <View className=" flex-row mx-5 mt-2 ">
                  <Text className="flex-1 font-semibold text-lg">Razon</Text>
                  <Text className="flex-1 font-semibold text-lg">Monto</Text>
                  <Text className="flex-1 font-semibold text-lg">
                    Creado en
                  </Text>
                  <Text className="flex-1 font-semibold text-lg">Estado</Text>
                </View>
              </>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
};

export default UserDetails;

const HeaderUserDetails = ({ user }: any) => {
  return (
    <>
      <View className=" flex flex-row justify-center items-center p-2 gap-5">
        <Image
          source={{
            uri: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
          }}
          className="size-20 rounded-full"
          resizeMode="contain"
        />

        <View className="flex flex-col items-center gap-2">
          <Text className="text-3xl">{user?.name}</Text>
          {user?.transacciones.some((item) => !item.isAlreadyPaid) ? (
            <Badge tipo="Con deuda" size="lg" />
          ) : (
            <Badge tipo="Al dia" size="lg" />
          )}
        </View>
        <View className="flex flex-col">
          <Text>Nro Transacciones : {user?.transacciones.length}</Text>
          <Text>
            Pendiente: ${" "}
            {user?.transacciones
              .filter((item) => !item.isAlreadyPaid)
              .reduce((total, item) => total + item.monto, 0)}
          </Text>
          <Text>
            Pagado: ${" "}
            {user?.transacciones
              .filter((item) => item.isAlreadyPaid)
              .reduce((total, item) => total + item.monto, 0)}
          </Text>
          <Text className="text-2xl font-semibold">
            Total : ${" "}
            {user?.transacciones.reduce((total, item) => total + item.monto, 0)}
          </Text>
        </View>
      </View>
    </>
  );
};
