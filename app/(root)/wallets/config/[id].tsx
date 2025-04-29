import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { NavBarBack } from "@/components";
import { useOrgStore } from "@/store/organization.store";
import { useLocalSearchParams } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import icons from "@/constants/icons";
import { updateOrganizationConfig } from "@/lib/appwrite";

const ConfigWallet = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const org = useOrgStore((state) => state.orgs).find((org) => org.$id === id);
  const [config, setconfig] = useState({
    showTransactions: org?.showTransactions || "",
    showSummary: org?.showSummary || "",
    showMembers: org?.showMembers || "",
  });

  const onPressSwitch = ({ id, value }: any) => {
    setconfig((prev) => ({ ...prev, [id]: value }));
    console.log({id, value});
    updateOrganizationConfig({ options:{ ...config, [id]: value } ,org_id: org?.$id});
  };

  return (
    <View>
      <NavBarBack>
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
            <Text className="ms-4 text-black-300">{org?.description}</Text>
          )}
        </View>
      </NavBarBack>
      <View className="flex flex-col gap-2 mx-5 mt-5">
        <Text className="text-3xl">Configuracion</Text>
        <View className="flex flex-col gap-3 items-center mt-2">
          <BouncyCheckbox
            id="transactions"
            textStyle={{
              textDecorationLine: "none",
              fontSize: 20,
              color: "black",
            }}
            size={25}
            fillColor="blue"
            text="Mostrar las transacciones de los integrantes"
            iconStyle={{ borderColor: "blue" }}
            innerIconStyle={{ borderWidth: 2 }}
            onPress={(isChecked: boolean) => {
              onPressSwitch({ id: "showTransactions", value: isChecked });
            }}
          />
          <BouncyCheckbox
            id="summary"
            textStyle={{
              textDecorationLine: "none",
              fontSize: 20,
              color: "black",
            }}
            size={25}
            fillColor="blue"
            text="Mostrar resumen de todas las finanzas (B-Clear)"
            iconStyle={{ borderColor: "blue" }}
            innerIconStyle={{ borderWidth: 2 }}
            onPress={(isChecked: boolean) => {
              onPressSwitch({ id: "showSummary", value: isChecked });
            }}
          />
          <BouncyCheckbox
            id="members"
            textStyle={{
              textDecorationLine: "none",
              fontSize: 20,
              color: "black",
            }}
            size={25}
            fillColor="blue"
            text="Mostrar todos los integrantes"
            iconStyle={{ borderColor: "blue" }}
            innerIconStyle={{ borderWidth: 2 }}
            onPress={(isChecked: boolean) => {
              onPressSwitch({ id: "showMembers", value: isChecked });
            }}
          />
        </View>
      </View>
      <Text className="m-5">{JSON.stringify(config)}</Text>
    </View>
  );
};

export default ConfigWallet;
