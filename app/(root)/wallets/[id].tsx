import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { Loading, NavBarBack, Badge, NoResults } from "@/components/";
import { CreatedUser, Organization } from "@/app/interfaces/user.interface";
import { useUserStore } from "@/store/user.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrgStore } from "@/store/organization.store";

const Wallet = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const user = useUserStore((state) => state.user);
  const orgs = useOrgStore((state) => state.orgs);

  const loadingUser = useUserStore((state) => state.loading);
  const loadingOrgs = useOrgStore((state) => state.loading);

  const [modalVisible, setModalVisible] = useState(false);

  const loading = loadingUser || loadingOrgs;

  if (loading) return <Loading />;

  const [filter, setFilter] = useState<null | string>("");

  const transaccionFilter = {
    Pagado: "Pagado",
    Pendiente: "Pendiente",
    Rechazado: "Rechazado",
  };

  const org =
    id == "personal"
      ? {
          $id: "personal",
          name: user.name,
          transactions: user.createdUsers?.flatMap((user: CreatedUser) =>
            user.transactions?.map((transaction) => {
              return {
                ...transaction,
                createdUser: user,
              };
            })
          ),
        }
      : orgs.find((org: Organization) => org.$id == id);

  const isAdmin = id == "personal" ? true : org?.admins.includes(user.$id);
  const isOrg = id != "personal";
  const { paid = 0, debt = 0 } = org?.transactions
    ?.filter((item) => item?.creditor.$id == user.$id)
    .reduce(
      (acc, item) => {
        if (item.isAlreadyPaid == true) {
          acc.paid += item.monto; // Sumar a los mtontos pagados
        } else if (item.isAlreadyPaid === null) {
          acc.debt += item.monto; // Sumar a los montos no pagados
        }
        return acc;
      },
      { paid: 0, debt: 0, pending: 0 } // Valores iniciales
    );
  const total = paid + debt;

  return (
    <SafeAreaView>
      <FlatList
        data={
          org?.transactions
            ?.filter((item) => {
              return isAdmin ? item : item?.creditor.$id == user.$id;
            })
            ?.filter((item) => {
              if (filter == "") return item;
              return filter == transaccionFilter.Pagado
                ? item?.isAlreadyPaid == true
                : item?.isAlreadyPaid == null;
            })
            .sort((a, b) => {
              return (
                new Date(b.$createdAt).getTime() -
                new Date(a.$createdAt).getTime()
              );
            }) ?? []
        }
        keyExtractor={(item) => item!.$id}
        contentContainerClassName="pb-20 gap-2"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View className="flex flex-1 flex-row mt-0 justify-around items-center px-3 bg-white py-1 mx-3 rounded-lg">
              {/* <Text>{JSON.stringify(item)}</Text> */}

              {isOrg && <Text className="max-w-20 min-w-20 line-clamp-2">{item?.creditor.name}</Text>}
              <Badge
                tipo={item?.isAlreadyPaid == true ? "Al dia" : "Pendiente"}
                size={"md"}
              ></Badge>
              <View className="flex-col items-center justify-around">
                <Text className="text-md"> {item.motivo}</Text>
                <Text className="text-sm text-black-200">
                  {item?.$createdAt.substring(0, 10)}{" "}
                </Text>
              </View>

              <View className="flex flex-col gap-1 items-center ">
                {item?.createdUser?.name && (
                  <Text className="text-sm">{item?.createdUser?.name}</Text>
                )}
                <Text className="text-sm text-black-100">${item?.monto} </Text>
              </View>
              {org?.$id == "personal" && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/createdUsers/${item?.createdUser.$id}`)
                  }
                  className=" flex  flex-2 p-1 bg-primary-100 rounded-full"
                >
                  <Image className="size-7" source={icons.chevronRight} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListHeaderComponent={
          <>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {}}
              className="flex-1 justify-center items-center"
            >
              <TouchableOpacity
                className="opacity-90 bg-gray-600 flex-1 justify-center items-center "
                onPress={() => setModalVisible((prev) => !prev)}
              >
                <View className="bg-white p-20 rounded-xl shadow-lg gap-4 flex items-center justify-center ">
                  <View className="flex flex-row gap-4 w-full justify-center items-center mt-3">
                    <TouchableOpacity
                      className="border border-red-500 p-2 rounded-xl font-semibold justify-center items-center"
                      onPress={() => setModalVisible((prev) => !prev)}
                    >
                      <Text className="p-1 font-semibold ">Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            <NavBarBack>
              <View className="flex-1 flex-row gap-2 justify-between items-center">
                <View className="flex flex-col ">
                  <View className="flex flex-row items-center rounded-full gap-2 px-2">
                    <Text className="text-2xl font-semibold">
                      {org?.name ?? "Wallet"}
                    </Text>
                    {org?.isTransparent && (
                      <Image
                        source={icons.transparency}
                        className="animate-pulse size-8"
                        tintColor={"#facc15"}
                      />
                    )}
                  </View>
                  {org?.description && (
                    <Text className="ms-4 text-black-300">
                      {org?.description}
                    </Text>
                  )}
                </View>

                {isAdmin && id != "personal" && (
                  <TouchableOpacity
                    onPress={() => 
    router.push(`/wallets/config/${id}`)
                      


                    }
                  >
                    <Image
                      className="size-8 text-black-300"
                      tintColor={"#191D31"}
                      source={icons.ellipsis}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </NavBarBack>
            <Summary paid={paid} debt={debt} total={total} isOrg />

            {id != "personal" && (
              <View className="flex flex-col px-2 items-center justify-center">
                <Text className=" my-1 text-2xl text-black-300">
                  Integrantes
                </Text>
                <FlatList
                  data={org?.members}
                  renderItem={({ item }) => (
                    <TouchableOpacity className="mx-2 my-1">
                      <Image
                        source={{ uri: item.avatar }}
                        className=" size-10  rounded-full"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  horizontal
                />
              </View>
            )}

            <View className="flex-row items-center p-2 ">
              <Text className="text-black-300 text-2xl font-semibold  px-3">
                Transacciones:{" "}
                {
                  org?.transactions
                    ?.filter((item) => item?.creditor.$id == user.$id)

                    .filter((item) => {
                      return filter == ""
                        ? item
                        : filter == transaccionFilter.Pagado
                        ? item?.isAlreadyPaid == true
                        : item?.isAlreadyPaid == null;
                    }).length
                }
              </Text>
              {/* Filters */}
              <View className="flex flex-row gap-2 items-center justify-center my-2 flex-1">
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
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View className=" flex-1 items-center justify-center">
            <NoResults />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const Summary = ({ paid, debt, total, isOrg }: any) => {
  return (
    <>
      <View className="flex flex-row items-center justify-around ">
        <View className=" flex-1 flex-col gap-5 p-3">
          {isOrg ? (
            <Text className="text-2xl text-black-300 font-semibold">
              Resumen de pagos
            </Text>
          ) : (
            <Text
              className={`text-xl p-3 rounded-xl bg-white text-center ${
                debt == 0 ? "bg-green-700" : "bg-yellow-200"
              }`}
            >
              {debt == 0 ? "Al dia" : "Tienes pagos pendientes"}
            </Text>
          )}
          <View className="flex flex-row gap-2 items-center justify-around">
            <Text className=" flex text-xl p-3 rounded-xl bg-white text-gray-600">
              Pagado: {paid}
            </Text>
            <Text className=" flex text-xl p-3 rounded-xl bg-white text-gray-600">
              Deuda: {debt}
            </Text>
            <Text className="flex text-xl p-3 rounded-xl bg-white text-gray-600">
              Total: {total}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Wallet;
