import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import JournalCard from "../components/JournalCard";

export default function PastJournalScreen({ navigation }) {
  const journals = [
    { date: "2025-11-25", score: 14, mood: 100, xp: 30 },
    { date: "2025-11-03", score: 13, mood: 25, xp: 25 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>지난 일기</Text>

        {journals.map((j, i) => (
          <JournalCard
            key={i}
            date={j.date}
            score={j.score}
            mood={j.mood}
            xp={j.xp}
            onPress={() => {}}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.homeButton}>
        <Text style={styles.homeText}>🏠 홈으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  homeButton: {
    backgroundColor: "#2457d6",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  homeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
