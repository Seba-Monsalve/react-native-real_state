import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { categories } from "@/constants/data";

const Filters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();
  const [selectedCategory, setselectedCategory] = useState(
    params.filter || "All"
  );

  const handleCategoryPress = (category: string) => () => {
    if (selectedCategory === category) {
      setselectedCategory("All");
      router.setParams({ filter: "All" });
      return;
    }
    setselectedCategory(category);
    router.setParams({ filter: category });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          key={index}
          className={`rounded-xl   px-2 py-1 ms-2 ${
            item.category === selectedCategory
              ? "bg-primary-300  border-gray-300"
              : "border-gray-300 border bg-white"
          }`}
          onPress={handleCategoryPress(item.category)}
        >
          <Text
            className={`${
              item.category === selectedCategory ? "text-white" : ""
            }`}
          >
            {" "}
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
