import { RegularCard } from "@/components/Card";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import SearchBar from "@/components/SearchBar";
import icons from "@/constants/icons";
import { getLastestProperties, getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    loading: loadingproperties,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: { query: params.query!, filter: params.filter!, limit: 20 },
    skip: true,
  });

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  useEffect(() => {
    refetch({ query: params.query!, filter: params.filter!, limit: 20 });
  }, [params.filter, params.query]);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        ListEmptyComponent={
          loadingproperties ? (
            <ActivityIndicator
              size={"large"}
              className="text-primary-300 mt-5"
            />
          ) : (
            <NoResults />
          )
        }
        data={properties}
        renderItem={({ item }) => (
          <RegularCard onPress={() => handleCardPress(item.$id)} item={item} />
        )}
        keyExtractor={(item) => item.$id.toString()}
        numColumns={2}
        contentContainerClassName={"pb-32"}
        columnWrapperClassName={"flex gap-5 px-5"}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                onPress={() => router.back()}
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className=" mr-2 text-base text-center font-rubik-medium text-black-300">
                Seacrh for your ideal Home
              </Text>
              <Image source={icons.bell} className=" w-6 h-6" />
            </View>
            <SearchBar />
            <View className="mt-5">
              <Filters />

              <Text className=" text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length} properties
              </Text>
            </View>
          </View>
        }
      ></FlatList>
    </SafeAreaView>
  );
}
