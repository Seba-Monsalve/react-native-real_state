import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Properties = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Properties</Text>
    </View>
  );
};

export default Properties;

const styles = StyleSheet.create({});
