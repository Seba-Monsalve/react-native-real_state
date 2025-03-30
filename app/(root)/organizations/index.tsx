import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import { getOrganizationById } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading, NavBarBack } from "@/components";
import icons from "@/constants/icons";

const Organization = () => {
  const { id } = useLocalSearchParams();
  const { data, loading } = useAppwrite({
    fn: getOrganizationById,
    params: { id },
  });

  const [organization, setorganization] = useState(null);

  useEffect(() => {
    if (data) setorganization(data);
  }, [data]);

  if (loading) return <Loading />;
  return (
    <SafeAreaView className="flex-1 mt-5">
      <ScrollView className="mx-5 flex">
        <NavBarBack title={organization?.name} />

        <View className=" flex-col  gap-4 items-center justify-center">
          <View className="w-full  items-center bg-red-200 rounded-lg py-7 px-3  justify-around flex-row ">
            <Image
              className="p-5 rounded-full bg-white size-20"
              source={icons.bath}
            />
            <View className="">
              <Text>{organization?.description}</Text>
              <Text>Nro integrantes: {organization?.members?.length}</Text>
              <Text>
                Activo desde {organization?.$createdAt.substring(0, 10)}
              </Text>
            </View>
          </View>

          <View>
            <View className="rounded-full p-3 bg-yellow-200 flex flex-col justify-center items-center">
              <Image source={icons.chat} className="size-10 " />
            </View>
            <Text> Uandas</Text>
          </View>

          <TouchableOpacity className="flex-1 items-center justify-center bg-white p-2 w-1/2 rounded-xl">
            <Text className="text-xl ">Solciitar unirse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Organization;
