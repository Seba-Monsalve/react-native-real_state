import { Image, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = () => {
  const path = usePathname();

  const params = useLocalSearchParams<{ query?: string }>();

  const [search, setsearch] = useState(params.query);

  const useDebounceSearch = useDebouncedCallback(
    (text: string) => router.setParams({ query: text }),
    600
  );

  const handleSearch = (query: string) => {
    setsearch(query);
    useDebounceSearch(query);
  };

  return (
    <View className="flex-row items-center justify-between  px-5  rounded-lg bg-accent-100 border border-primary-100 mt-2 py-2">
      <Image source={icons.search} className="size-5" />
      <TextInput
        value={search}
        onChangeText={handleSearch}
        inputMode="text"
        placeholder="Search an user"
        className=" font-rubik text-black-300 ml-2 flex-1"
        scrollEnabled={false}
      />
      <TouchableOpacity
        onPress={() => {
          setsearch("");
          router.setParams({ query: "" });
        }}
      >
        <Image source={icons.clear} className="size-6" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
