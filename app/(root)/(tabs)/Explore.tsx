import { Header, Loading, NavBarBack, SearchBar } from "@/components";
import { OrganizationCard } from "@/components/OrganizationCard";
import { getOrganizations } from "@/lib/appwrite";
import GlobalProvider, { useGlobalContext } from "@/lib/global-context";
import { useAppwrite } from "@/lib/useAppwrite";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  const { user } = useGlobalContext();
  const { data, loading } = useAppwrite({
    fn: getOrganizations,
  });
  const [organizations, setorganizations] = useState([]);

  const params = useLocalSearchParams<{ query?: string }>();

  useEffect(() => {
    if (data) {
      setorganizations(data.documents);
    }
  }, [data]);

  if (loading) return <Loading />;

  return (
    <SafeAreaView className=" bg-[#eee] mt-5 flex-1">
      <FlatList
        data={organizations?.filter((item) => {
          if (params.query != "" && params.query)
            return item.name
              .toLowerCase()
              .includes(params.query?.toLowerCase()) || item.description
              .toLowerCase()
              .includes(params.query?.toLowerCase());
          return item;
        })}
        contentContainerClassName="gap-3"
        bounces
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <OrganizationCard organization={item} />}
        ListHeaderComponent={
          <ScrollView className="mx-5">
            <Header avatar={user?.avatar!} name={user?.name!} />
            <Text className=" mt-5 mb-2  text-3xl text-black-300">
              Explora Organizaciones
            </Text>
            <SearchBar placeholder="Busca una Organizacion" />
          </ScrollView>
        }
      />
    </SafeAreaView>
  );
}
