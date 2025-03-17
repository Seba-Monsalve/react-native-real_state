import { FeaturedCard, RegularCard } from "@/components/Card";
import Filters from "@/components/Filters";
import SearchBar from "@/components/SearchBar";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-context";
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const {user} = useGlobalContext()
  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({ item }) => <RegularCard></RegularCard>}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName={"pb-32"}
        columnWrapperClassName={"flex gap-5 px-5"}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className=" px-5">
            <View className=" flex flex-row items-center justify-between mt-5">
              <View className=" flex flex-row items-center">
                <Image
                  source={{uri:user?.avatar}}
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
              data={[1, 2]}
              renderItem={({ item }) => <FeaturedCard />}
              keyExtractor={(item) => item.toString()}
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
