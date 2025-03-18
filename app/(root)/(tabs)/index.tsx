import { FeaturedCard, RegularCard } from "@/components/Card";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import SearchBar from "@/components/SearchBar";
import icons from "@/constants/icons";
import { getLastestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-context";
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

export default function Index() {
  const { user } = useGlobalContext();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: loadinglatestProperties } =
    useAppwrite({ fn: getLastestProperties });

  const {
    data: properties,
    loading: loadingproperties,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: { query: params.query!, filter: params.filter!, limit: 2 },
    skip: true,
  });

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  useEffect(() => {
    refetch({ query: params.query!, filter: params.filter!, limit: 6 });
  }, [params.filter, params.query]);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        ListEmptyComponent={
          loadingproperties ? <ActivityIndicator size={'large'} className="text-primary-300 mt-5"  /> : <NoResults />
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
          <View className=" px-5">
            <View className=" flex flex-row items-center justify-between mt-5">
              <View className=" flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className=" font-rubik-medium text-black-300 text-base">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <SearchBar />

            <View className="mt-3">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-semibold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-xl font-rubik-semibold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              ListEmptyComponent={
                loadinglatestProperties ? <ActivityIndicator  size={'large'} className="text-primary-300 mt-5"  /> : <NoResults />
              }
              data={latestProperties}
              renderItem={({ item }) => (
                <FeaturedCard
                  onPress={() => handleCardPress(item.$id)}
                  item={item}
                />
              )}
              keyExtractor={(item) => item.$id.toString()}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex flex-row gap-5 mt-3 "
            />

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-semibold text-black-300">
                  Our Recommendations
                </Text>

                <TouchableOpacity>
                  <Text className="text-xl font-rubik-semibold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <Filters />
            </View>
          </View>
        }
      ></FlatList>
    </SafeAreaView>
  );
}
