import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-context";
import { Redirect, useRouter } from "expo-router";

export function SignIn() {
  const { refetch, loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) {
    return <Redirect href="/" />;
  }

  async function handleLogin() {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Login failed");
    }
  }

  return (
    <SafeAreaView className=" bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />
        <Text className="text-black"> {isLogged ? "si log" : "no log"}</Text>

        <View className=" px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to ReState
          </Text>

          <Text className="text-3xl font-rubik-bold text-blue-300 text-center mt-2">
            Let's get you closer to {"\n"}
            <Text className="text-primary-300">your ideal Home </Text>
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to ReState with Google
          </Text>
          <TouchableOpacity
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
            onPress={handleLogin}
          >
            <View className="flex flex-row items-center justify-center gap-5">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text>Continue With Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn;
