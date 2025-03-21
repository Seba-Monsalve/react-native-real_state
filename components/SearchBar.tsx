import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
    500
  );

  const handleSearch = (query: string) => {
    setsearch(query);
    useDebounceSearch(query);
  };

  return (
    <View className=" flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-2 py-2">
      <View className=" flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />

        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search an user"
          className="text-sm font-rubik text-black-300 ml-2 flex-1"
        />
      </View>
      <TouchableOpacity>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
