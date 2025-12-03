import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TodayScreen({ navigation }) {
  const pet = {
    name: "루미",
    level: 1,
    xp: 80,
    maxXp: 100,
    intimacy: 1,
    mood: "calm",
  };

  return (
    <View style={styles.container}>
      <View style={styles.petBox}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text>레벨 {pet.level} ( XP {pet.xp}/{pet.maxXp} )</Text>
        <Text>친밀도 {pet.intimacy}/5</Text>
        <Text>기분: {pet.mood}</Text>
      </View>

      <Text style={styles.streak}>연속 작성: 0일</Text>

      <TouchableOpacity style={styles.writeBtn}
         onPress={() => navigation.navigate("TodayJournal")}    
      >
        <Text style={styles.writeText}>오늘의 일기 쓰기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => navigation.navigate("Past")}
      >
        <Text style={styles.menuText}>지난 일기 보기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBtn}
        onPress={() => navigation.navigate("Calendar")}  >
        <Text style={styles.menuText}>히트맵 달력 보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  petBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#fff",
  },
  petName: { fontWeight: "700", marginBottom: 6, fontSize: 16 },
  streak: {
    marginVertical: 20,
    color: "#444",
  },
  writeBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  writeText: {
    color: "white",
    fontWeight: "700",
  },
  menuBtn: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  menuText: { fontSize: 15 },
});
