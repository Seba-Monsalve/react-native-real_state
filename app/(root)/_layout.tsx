import { getCurrentUser } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserStore } from "@/store/user.store";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout({}) {
    
      const {
        data: user,
        loading,
        refetch,
      } = useAppwrite({
        fn: getCurrentUser,
      });
    
      const store = useUserStore;
      store.setState({ user, loading, refetch });
    


  if (loading)
  {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator
          className="text-primary-300"
          size={"large"}
        ></ActivityIndicator>
      </SafeAreaView>
    );
  }


  if (!user) {
    return <Redirect href={"/SignIn"} />;
  }
  return <Slot></Slot>;
}
