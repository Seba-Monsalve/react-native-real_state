import { showToast } from "@/app/utils/Toast";
import { WalletCard, Header, UserCard, Loading, SearchBar } from "@/components";
import { createUser } from "@/lib/appwrite";
import { useUserStore } from "@/store/user.store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((action) => action.updateUser);
  const refetch = useUserStore((state) => state.refetch);
  const loading = useUserStore((state) => state.loading);

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [modalVisible, setModalVisible] = useState(false);

  const [action, setaction] = useState<{ name: string; created_by: string }>({
    name: "",
    created_by: "",
  });

  const handleOnPressWallet = (id: string) => {
    router.push(`/wallets/${id}`);
  };

  return (
    <SafeAreaView className=" bg-[#eee] mt-5 flex-1">
      <FlatList
        data={user?.createdUsers?.filter((user) => {
          if (params.query != "" && params.query)
            return user.name
              .toLowerCase()
              .includes(params.query?.toLowerCase());
          return user;
        })}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-20 gap-2"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return <UserCard {...item} />;
        }}
        numColumns={3}
        ListEmptyComponent={
          <>
            <Text className="mt-5 text-center text-xl">
              No hay resultados para la busqueda
            </Text>
          </>
        }
        ListHeaderComponent={
          <ScrollView className="mx-5">
            <Header avatar={user?.avatar!} name={user?.name!} />
            <View className="mt-3">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[
                  {
                    $id: "personal",
                    name: "Personal",
                    transactions: user.createdUsers?.flatMap(
                      (user) => user.transactions
                    ),
                  },
                ].concat(
                  user?.memberOf.map((item) => ({
                    name: item.name,
                    transactions: item.transactions,
                    $id: item.$id,
                  }))
                )}
                renderItem={({ item }) => {
                  return (
                    <WalletCard
                      title={item.name}
                      item={item.transactions}
                      onPress={() => handleOnPressWallet(item!.$id)}
                    />
                  );
                }}
              />
            </View>
            {/* Barra notificar */}
            {/* <View className=" mt-8 bg-white rounded-lg">
              <View className="flex flex-row justify-around -mt-7 py-2">
                <ActionItem
                  icon={icons.person}
                  text={"Notificar"}
                  onPress={() => {
                    router.push("/Request");
                  }}
                />
                <ActionItem icon={icons.search} text={"Enviar"} />
                <ActionItem icon={icons.home} text={"Send"} />
              </View>
            </View> */}

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {}}
            >
              <TouchableOpacity
                className="opacity-90 bg-gray-600 flex-1 justify-center items-center "
                onPress={() => {
                  setaction({ name: "", created_by: "" });
                  setModalVisible((prev) => !prev);
                }}
              >
                <View className="bg-white p-20 rounded-xl shadow-lg gap-4 flex items-center justify-center ">
                  <Text className="text-2xl">Crear usuario</Text>
                  <View className="flex flex-row justify-center items-center gap-2 ">
                    <Text>Nombre: </Text>
                    <TextInput
                      onChangeText={(value) => {
                        setaction((prev) => ({ ...prev, name: value }));
                      }}
                      placeholder=""
                      keyboardType="default"
                      className="text-sm bg-gray-200 rounded-lg w-2/3  "
                    />
                  </View>

                  <View className="flex flex-row gap-4 w-full justify-center items-center mt-3">
                    <TouchableOpacity
                      className="border border-red-500 p-2 rounded-xl font-semibold justify-center items-center"
                      onPress={() => setModalVisible((prev) => !prev)}
                    >
                      <Text className="p-1 font-semibold ">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-green-400 p-2 rounded-xl font-semibold text-white justify-center items-center"
                      onPress={async () => {
                        if (action.name?.length === 0) {
                          showToast("El nombre no puede estar vacio");
                          return;
                        }
                        const createdUser = await createUser({
                          ...action,
                          created_by: user!.$id,
                        });
                        updateUser({
                          ...user,
                          createdUsers: [...user.createdUsers].concat(
                            createdUser
                          ),
                        });
                        createdUser
                          ? showToast("usuario creado con exito")
                          : showToast("Error al crear usuario");
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <Text className="p-1 font-semibold ">Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            <View className="  flex-1 flex-col justify-around items-center mt-4 mb-2">
              <View className=" flex flex-row justify-between items-center w-full px-4 gap-3">
                <Text className="text-2xl font-semsibold text-black-300 ">
                  Tus usuarios{" "}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text className="px-2 p-1 text-lg font-semibold rounded-lg  text-white bg-primary-300">
                    Agregar
                  </Text>
                </TouchableOpacity>
              </View>
              <SearchBar placeholder="Buscar Usuario" />
            </View>
            {/* <Text>{JSON.stringify(user.transactions)}</Text> */}
          </ScrollView>
        }
      />
    </SafeAreaView>
  );
}
