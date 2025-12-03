// screens/JournalDetailScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 오늘 날짜 (로컬) 구하는 함수
const getTodayLocalDate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;  // 예: "2025-12-02"
};

export default function JournalDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { journal, allJournals } = route.params; // Past에서 넘겨줌

  const [text, setText] = useState(journal.text || "");
  const [showEditButtons, setShowEditButtons] = useState(false);

  // 현재 일기의 인덱스, 이전/다음 존재 여부 계산
  const { hasPrev, hasNext, prevJournal, nextJournal } = useMemo(() => {
    if (!Array.isArray(allJournals)) {
      return {
        hasPrev: false,
        hasNext: false,
        prevJournal: null,
        nextJournal: null,
      };
    }
    const idx = allJournals.findIndex(
      (j) => String(j.id) === String(journal.id)
    );
    return {
      hasPrev: idx > 0,
      hasNext: idx >= 0 && idx < allJournals.length - 1,
      prevJournal: idx > 0 ? allJournals[idx - 1] : null,
      nextJournal:
        idx >= 0 && idx < allJournals.length - 1
          ? allJournals[idx + 1]
          : null,
    };
  }, [allJournals, journal]);

  // 저장 (오늘 일기면 시간도 현재로 변경)
  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem("journals");
      const list = saved ? JSON.parse(saved) : [];

      const today = getTodayLocalDate();
      const isToday = journal.date === today;

      let newTime = journal.time || null;
      if (isToday) {
        const now = new Date();
        newTime = now.toTimeString().slice(0, 5); // "HH:MM"
      }

      const updated = list.map((j) =>
        String(j.id) === String(journal.id)
          ? {
              ...j,
              text,
              length: text.length,
              time: newTime,
            }
          : j
      );

      await AsyncStorage.setItem("journals", JSON.stringify(updated));
      navigation.goBack();
    } catch (e) {
      console.log("수정 저장 실패:", e);
    }
  };

  // 삭제
  const handleDelete = async () => {
    try {
      if (Platform.OS === "web") {
        const ok = window.confirm("정말로 삭제하시겠습니까?");
        if (!ok) return;
      }
      const saved = await AsyncStorage.getItem("journals");
      const list = saved ? JSON.parse(saved) : [];
      const filtered = list.filter(
        (j) => String(j.id) !== String(journal.id)
      );
      await AsyncStorage.setItem("journals", JSON.stringify(filtered));
      navigation.goBack();
    } catch (e) {
      console.log("삭제 실패:", e);
    }
  };

  // 이전 / 다음 일기로 이동
  const goToPrev = () => {
    if (!prevJournal) return;
    navigation.replace("JournalDetail", {
      journal: prevJournal,
      allJournals,
    });
  };

  const goToNext = () => {
    if (!nextJournal) return;
    navigation.replace("JournalDetail", {
      journal: nextJournal,
      allJournals,
    });
  };

  return (
    <View style={styles.container}>
      {/* 상단 날짜/시간, 점수 정보 */}
      <View style={styles.headerBox}>
        <Text style={styles.dateText}>
          {journal.date} {journal.time || ""}
        </Text>
        <Text style={styles.metaText}>
          점수 {journal.score ?? journal.length}점 · 기분 {journal.mood ?? 0}점 · XP +
          {journal.xp ?? 0}
        </Text>
      </View>

      {/* 내용 */}
      <View style={styles.editorBox}>
        <Text style={styles.label}>작성한 내용</Text>
        <TextInput
          style={styles.input}
          multiline
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
          maxLength={2000}
          onFocus={() => setShowEditButtons(true)}  // 한 번 터치하면 저장/삭제 모드로
        />
        <Text style={styles.charCount}>{text.length}자</Text>
      </View>

      {/* 1) 작성란 건드린 후: 저장/삭제만 보임 */}
      {showEditButtons && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2) 처음 화면: <, > 또는 홈 버튼만 보임 */}
      {!showEditButtons && (
        <View style={styles.bottomNav}>
          {hasPrev && (
            <TouchableOpacity style={styles.arrowBtn} onPress={goToPrev}>
              <Text style={styles.arrowText}>‹ 이전 일기</Text>
            </TouchableOpacity>
          )}

          {hasNext && (
            <TouchableOpacity style={styles.arrowBtn} onPress={goToNext}>
              <Text style={styles.arrowText}>다음 일기 ›</Text>
            </TouchableOpacity>
          )}

          {!hasPrev && !hasNext && (
            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => navigation.navigate("Today")}
            >
              <Text style={styles.homeText}>홈으로 돌아가기</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  headerBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e3f2fd",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1976d2",
    marginBottom: 4,
  },
  metaText: { fontSize: 14, color: "#555", fontWeight: "500" },
  editorBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  label: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 8 },
  input: {
    flex: 1,
    minHeight: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  charCount: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 13,
    color: "#777",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 6,
    alignItems: "center",
  },
  saveText: { color: "white", fontWeight: "800", fontSize: 15 },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: "center",
  },
  deleteText: { color: "white", fontWeight: "800", fontSize: 15 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  arrowBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  arrowText: {
    color: "#2457d6",
    fontSize: 14,
    fontWeight: "600",
  },
  homeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2457d6",
    alignItems: "center",
  },
  homeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
});
