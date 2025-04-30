import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { Loading, NavBarBack, Badge, NoResults } from "@/components/";
import { CreatedUser, Organization } from "@/app/interfaces/user.interface";
import { useUserStore } from "@/store/user.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrgStore } from "@/store/organization.store";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Wallet = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const user = useUserStore((state) => state.user);
  const orgs = useOrgStore((state) => state.orgs);

  const loadingUser = useUserStore((state) => state.loading);
  const loadingOrgs = useOrgStore((state) => state.loading);
  const refetch = useOrgStore((state) => state.refetch);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userTransactions, setuserTransactions] = useState(false);

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

  const { paid = 0, debt = 0 } = org
    ?.transactions!?.filter((item) => {
      if (org?.$id == "personal") return item;
      return org?.showTransactions ? item : item?.creditor.$id == user.$id;
    })
    .reduce(
      (acc, item) => {
        if (item?.isAlreadyPaid == true) {
          acc.paid += item.monto; // Sumar a los mtontos pagados
        } else if (item?.isAlreadyPaid === null) {
          acc.debt += item.monto; // Sumar a los montos no pagados
        }
        return acc;
      },
      { paid: 0, debt: 0, pending: 0 } // Valores iniciales
    );
  const total = paid + debt;

  const { personalPaid, personalDebt } = org
    ?.transactions!?.filter((item) =>
      org?.$id == "personal" ? item : item?.creditor.$id == user.$id
    )
    .reduce(
      (acc, item) => {
        if (item?.isAlreadyPaid == true) {
          acc.personalPaid += item.monto; // Sumar a los mtontos pagados
        } else if (item?.isAlreadyPaid === null) {
          acc.personalDebt += item.monto; // Sumar a los montos no pagados
        }
        return acc;
      },
      { personalPaid: 0, personalDebt: 0, pending: 0 } // Valores iniciales
    );
  const personalTotal = personalPaid + personalDebt;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    refetch({});

    setRefreshing(false);
  }, []);


  console.log('render');
  return (
    <SafeAreaView>
      <FlatList
        data={
          org?.transactions
            ?.filter((item) => {
              if (org?.$id == "personal") return item;
              return (isAdmin || org?.showTransactions) && !userTransactions
                ? item
                : item?.creditor.$id == user.$id;
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
        keyExtractor={(item) => {
          return item!.$id;
        }}
        contentContainerClassName="pb-20 gap-2"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View className="flex flex-1 flex-row mt-0 justify-around items-center px-3 bg-white py-1 mx-3 rounded-lg text-center ">

              {isOrg && (
                <Text className="max-w-20 min-w-20 line-clamp-2 text-center">
                  {item?.creditor.name}
                </Text>
              )}
              <Badge 
                tipo={item?.isAlreadyPaid == true ? "Al dia" : "Pendiente"}
                size={"md"}
              />
              <View className="flex-col items-center justify-around text-center max-w-30 min-w-30">
                <Text className="text-md"> {item.motivo}</Text>
                <Text className="text-sm text-black-200">
                  {item?.$createdAt.substring(0, 10)}{" "}
                </Text>
              </View>

              <View className="flex flex-col gap-1 items-center max-w-30 ">
                {item?.createdUser?.name && (
                  <Text className="text-sm">{item?.createdUser?.name}</Text>
                )}
                <Text className="text-sm text-black-100">${item?.monto} </Text>
              </View>
              {org?.$id == "personal" && (
                <TouchableOpacity
                  onPress={() => {

                    return router.push(
                      `/createdUsers/${item?.createdUser.$id}`
                    );
                  }}
                  className=" flex  flex-2 p-1 bg-primary-100 rounded-full"
                >
                  <Image className="size-7" source={icons.chevronRight} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListHeaderComponent={
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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

                {isAdmin && org?.$id != "personal" && (
                  <TouchableOpacity
                    onPress={() => router.push(`/wallets/config/${id}`)}
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
            {(org?.$id=='personal' || org?.showTransactions) && (
              <>
              <GlobalSummary paid={paid} debt={debt} total={total} isOrg />
              </>
            )}

            {!isAdmin && (
              <PersonalSummary
                paid={personalPaid}
                debt={personalDebt}
                total={personalTotal}
                isOrg
              />
            )}

            {/* MEMBERS */}
          
            
            {(isAdmin || org?.showMembers)  && (
              
                <View className="flex flex-col p-2 my-2 rounded-xl items-center justify-center bg-gray-200">
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

            <View className="flex-col  justify-center items-centerx p-2 ">
              <Text className="text-black-300 text-2xl font-semibold  px-3">
                Transacciones:{" "}
                {
                  org?.transactions
                    ?.filter((item) => {
                      if (org.$id == "personal") return item;

                      return org?.showTransactions && !userTransactions
                        ? item
                        : item?.creditor.$id == user.$id;
                    })

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
              <View className="flex flex-row gap-3  text-center  w-full justify-center mt-2 ">
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

                {!isAdmin && org?.showTransactions && (
                  <>
                    <BouncyCheckbox
                      id="showTransactions"
                      textStyle={{
                        textDecorationLine: "none",
                        fontSize: 20,
                        color: "black",
                      }}
                      size={20}
                      fillColor="green"
                      iconStyle={{ borderColor: "green" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      onPress={(isChecked: boolean) => {
                        setuserTransactions(isChecked);
                      }}
                      isChecked={userTransactions}
                    />
                    <Text className="-ml-5  py-1">Solo mis Tx's</Text>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
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

const GlobalSummary = ({ paid, debt, total, isOrg }: any) => {
  return (
    <>
      <View className="flex flex-row items-center justify-around flex-wrap ">
        <View className=" flex flex-col gap-2 p-2">
          <Text className="text-2xl text-black-300 font-semibold">
            Resumen Global
          </Text>
          <View className="flex flex-row flex-wrap gap-2 items-center justify-around text-center">
            <Text className=" flex text-xl p-2 rounded-xl bg-white text-gray-600">
              Pagado: {paid}
            </Text>
            <Text className=" flex text-xl p-2 rounded-xl bg-white text-gray-600">
              Deuda: {debt}
            </Text>
            <Text className="flex text-xl p-2 rounded-xl bg-white text-gray-600">
              Total: {total}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
const PersonalSummary = ({ paid, debt, total, isOrg }: any) => {
  return (
    <>
      <View className="flex flex-row items-center justify-around  ">
        <View className=" flex-1 flex-col gap-2 p-3">
          <Text className="text-2xl text-black-300 font-semibold mt-1">
            Tu Resumen Personal
          </Text>
          <Text
            className={`text-xl p-3 rounded-xl bg-white text-center my-2 ${
              debt == 0 ? "bg-[#bbf7d0]" : "bg-yellow-200"
            }`}
          >
            {debt == 0 ? "Estas Al dia" : "Tienes pagos pendientes"}
          </Text>
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
