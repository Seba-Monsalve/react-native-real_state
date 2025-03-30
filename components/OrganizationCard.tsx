import icons from "@/constants/icons";
import {
  createOrganizationRequest,
  getOrganizationRequestById,
} from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Loading } from "./Loading";
import { showToast } from "@/app/utils/Toast";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";

export const OrganizationCard = ({ organization }: any) => {
  const user = useUserStore(state =>state.user)

  const {
    name,
    description,
    people = 20,
    isTransparent,
    $id: id,
  } = organization;

  const { data, loading } = useAppwrite({
    fn: getOrganizationRequestById,
    params: { org_id: id, user_id: user?.user?.$id },
  });

  const [request, setrequest] = useState([]);

  useEffect(() => {
    if (data) setrequest(data.documents);
  }, [data]);

  if (loading) <Loading />;

  // let requestStatus = () => {
  //   if (data?.documents.lenght == 0) return undefined;
  //   return data?.documents[0].isAproved;
  // };
  // console.log({statu:requestStatus()});

  const onPress = async (id: string) => {
    setrequest([]);
    const newRequest = await createOrganizationRequest({
      user_id: user.user?.$id,
      org_id: id,
    });
    if (newRequest) {
      showToast("Solicitud enviada");
      return;
    }
    showToast("Error al enviar solicitud");
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg mx-5 gap-4 shadow-md flex-row items-center justify-between p-3 relative h-24 "
      onPress={() => onPress(id)}
    >
      <View className="bg-blue-200 rounded-full p-2">
        <Image tintColor={"blue"} className="size-8" source={icons.carPark} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-black-300">{name}</Text>
        <Text className="text-black-200">{description}</Text>
      </View>
      <View className=" flex-col items-center justify-center w-36 gap-2">
        <View className=" flex-row items-center gap-1 px-3 py-2 bg-gray-100 justify-center w-16   rounded-full">
          <Image source={icons.people} className="size-5" />
          <Text className="">+{people}</Text>
        </View>

     {loading ||request == null ?   (
          <Loading />
        ) : request?.length != 0 ? (
          request[0]?.isAproved != null ? (
            request[0]?.isAproved ? (
              <Text className=" bg-green-500 p-1 font-semibold text-white rounded-lg ">
                Aceptado
              </Text>
            ) : (
              <Text className=" bg-red-500 p-1 font-semibold text-white rounded-lg ">
                Rechazado
              </Text>
            )
          )
           : (
            <Text className=" bg-primary-300 p-1 font-semibold text-white rounded-lg ">
              Solicitud Enviada
            </Text>
          )
        ) : (
          <Text className=" bg-orange-400 p-1 font-semibold text-white rounded-lg ">
            Solicitar Unirse
          </Text>
        )} 
      </View>

      {isTransparent && (
        <View className="absolute top-2 left-11 z-10 flex flex-row items-center  animate-pulse">
          <Image
            source={icons.transparency}
            className={"size-8"}
            tintColor={isTransparent == true ? "#eab308" : "#d1d5db"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
