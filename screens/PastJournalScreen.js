import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform  } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JournalCard from "../components/JournalCard";


export default function PastJournalScreen({ navigation }) {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    loadJournals();
    const unsubscribe = navigation.addListener("focus", loadJournals);
     return () => unsubscribe();   // ✅ cleanup 올바르게
  }, [navigation]);

  const loadJournals = async () => {
    try {
      const savedJournals = await AsyncStorage.getItem("journals");
      console.log("로딩 시점의 저장소 값:", savedJournals);
      if (savedJournals) {
        const parsed = JSON.parse(savedJournals);
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setJournals(sorted);
        console.log("화면에 세팅된 개수:", sorted.length);
      } else {
        setJournals([]);
      }
    } catch (e) {
      console.error("Load journals error:", e);
      setJournals([]);
    }
  };

  // 삭제 처리 함수
  const deleteJournal = (id) => {
  console.log("🗑 삭제 요청 id:", id, typeof id);

  // 웹이면 window.confirm 사용
  if (Platform.OS === "web") {
    const ok = window.confirm("정말로 삭제하시겠습니까?");
    if (!ok) return;
    actuallyDelete(id);
    return;
  }

  // 모바일(iOS/Android)에서는 Alert.alert 사용
  Alert.alert(
    "일기 삭제",
    "정말로 삭제하시겠습니까?",
    [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => actuallyDelete(id),
      },
    ]
  );
};
const actuallyDelete = async (id) => {
  try {
    const filtered = journals.filter(j => String(j.id) !== String(id));
    await AsyncStorage.setItem("journals", JSON.stringify(filtered));
    setJournals(filtered);
  } catch (e) {
    console.error("삭제 실패:", e);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>지난 일기 ({journals.length}개)</Text>

        {journals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 작성된 일기가 없습니다.</Text>
            <Text style={styles.emptySubtext}>홈에서 일기를 작성해보세요!</Text>
          </View>
        ) : (
          journals.map(j => (
           <JournalCard
            key={j.id}
            date={j.date}
            time={j.time || null}
            score={j.score || j.length}
            mood={j.mood || 0}
            xp={j.xp || 0}
            onDelete={() => deleteJournal(j.id)}
            onPress={() =>
              navigation.navigate("JournalDetail", {
                journal: j,
                allJournals: journals,
              })
            }
          />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Today")}
      >
        <Text style={styles.homeText}>🏠 홈으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 24, color: "#333" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#666", marginBottom: 8, textAlign: "center" },
  emptySubtext: { fontSize: 16, color: "#999", textAlign: "center" },
  homeButton: {
    backgroundColor: "#2457d6",
    padding: 18,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  homeText: { color: "white", fontSize: 17, fontWeight: "700" },
});
