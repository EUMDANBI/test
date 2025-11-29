import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function JournalCard({ date, score, mood, xp, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.text}>점수: {score} · 기분: {mood} · XP +{xp}</Text>
      <Text style={styles.link}>작성한 내용 보기</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  date: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  text: {
    color: "#555",
  },
  link: {
    marginTop: 8,
    color: "#555",
    textDecorationLine: "underline",
    fontSize: 13,
  },
});
