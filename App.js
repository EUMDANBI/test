import React from "react";
import { StyleSheet } from "react-native"; 
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodayScreen from "./screens/TodayScreen";
import PastJournalScreen from "./screens/PastJournalScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Today" 
          component={TodayScreen} 
          options={{ title: "오늘의 일기 → MY펫 성장" }}
        />
        <Stack.Screen 
          name="Past" 
          component={PastJournalScreen} 
          options={{ title: "지난 일기" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
