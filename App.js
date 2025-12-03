// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodayScreen from "./screens/TodayScreen";
import PastJournalScreen from "./screens/PastJournalScreen";
import TodayJournalScreen from "./screens/TodayJournalScreen";
import CalendarScreen from "./screens/CalendarScreen";
import JournalDetailScreen from "./screens/JournalDetailScreen";

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
        <Stack.Screen
          name="TodayJournal"
          component={TodayJournalScreen}
          options={{ title: "일기 작성" }}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ title: "히트맵 달력" }}
        />
        <Stack.Screen
        name="JournalDetail"
        component={JournalDetailScreen}
        options={{ title: "일기 상세" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
