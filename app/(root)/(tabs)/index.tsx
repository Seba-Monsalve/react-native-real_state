import { Link } from "expo-router";
import { View,Text } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center gap-2 textre">

      <Text className=" text-2xl text-green-500">Welcome to real state</Text>
      <Link href="/SignIn">Sign In</Link>
      <Link href="/Explore">Explore</Link>
      <Link href="/Profile">      <Link href="/Profile">profile</Link>
      </Link>
      <Link href="/properties/1">properties</Link>
    </View>
  );
}
