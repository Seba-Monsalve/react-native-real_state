import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import NavBarBack from "@/components/NavBarBack";
import SearchBar from "@/components/SearchBar";
import { useAppwrite } from "@/lib/useAppwrite";
import { getUsers } from "@/lib/appwrite";
import { UserItem } from "@/components/UserItem";
import { useGlobalContext } from "@/lib/global-context";
import { jsx } from "react/jsx-runtime";

const Request = () => {
  const { data: users, loading } = useAppwrite({ fn: getUsers });
  const user = useGlobalContext();

  return loading ? (
    <ActivityIndicator size={10} />
  ) : (
    <View className="flex-1 mt-5 px-3 mx-2">
      <NavBarBack title="Buscar persona" />
      <SearchBar />
      {users!.map((user) => (
        <UserItem key={user.$id} {...user} />
      ))}

      <Text>{JSON.stringify(user.user.$id)}</Text>
    </View>
  );
};

export default Request;
