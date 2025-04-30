import { getCurrentUser, getOrganizations } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useOrgStore } from "@/store/organization.store";
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
      
      const {
        data: organizations,
        loading:loadingOrgs,
        refetch: refetchOrgs,
      } = useAppwrite({
        fn: getOrganizations,
      });


      console.log({refetchOrgs});

      const userStore = useUserStore;
      const orgStore = useOrgStore;

      userStore.setState({ user, loading, refetch });
    
      orgStore.setState({orgs: organizations?.documents, loadingOrgs, refetch:refetchOrgs });
    
      

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
