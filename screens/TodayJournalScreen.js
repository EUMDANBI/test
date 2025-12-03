import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const EMOTIONS = [
  { key: "happy", label: "😊 기쁨", score: 20 },
  { key: "love", label: "💕 사랑", score: 25 },
  { key: "excited", label: "🎉 설렘", score: 22 },
  { key: "calm", label: "😌 평온", score: 15 },
  { key: "sad", label: "😢 슬픔", score: -10 },
  { key: "anger", label: "😣 화남", score: -20 }
];
const MIN_LENGTH = 15;

export default function TodayJournalScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState({});
  const [journals, setJournals] = useState([]);
  const [streak, setStreak] = useState(0);
  const [petLevel, setPetLevel] = useState(1);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  try {
    const savedJournals = await AsyncStorage.getItem("journals");
    if (savedJournals) {
      const parsed = JSON.parse(savedJournals);
      setJournals(parsed);
      
      const today = getTodayLocalDate();  // 👈 여기 변경
      const todayJournal = parsed.find(j => j.date === today);
      if (todayJournal) {
        setText(todayJournal.text || "");
        setEmotions(todayJournal.emotions || {});
      }

      // 스트릭 계산은 그대로 둬도 됨 (date 문자열 비교)
      const weekAgo = new Date(Date.now() - 7*24*60*60*1000)
        .toISOString()
        .split("T")[0];
      const recentCount = parsed.filter(j => j.date >= weekAgo).length;
      setStreak(recentCount);
      setPetLevel(Math.floor(recentCount / 7) + 1);
    }
  } catch (error) {
    console.log("로드 에러:", error);
  }
};

const getTodayLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // 예: "2025-12-02"
};

  // 감정 토글
  const toggleEmotion = (key) => {
    setEmotions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 기분 점수 계산
  const calcMoodScore = () => {
    return Object.keys(emotions).reduce((sum, key) => {
      if (emotions[key]) {
        const emotion = EMOTIONS.find(e => e.key === key);
        return sum + (emotion?.score || 0);
      }
      return sum;
    }, 0);
  };

  // 저장 버튼 활성화 체크
  const isSaveDisabled = () => {
    return text.length < MIN_LENGTH;
  };

  // 일기 저장
   const saveJournal = async () => {
  if (isSaveDisabled()) {
    Alert.alert("알림", "15자 이상 작성해주세요!");
    return;
  }

  try {
    const today = getTodayLocalDate(); // 👈 여기 변경
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const moodScore = calcMoodScore();

    const newJournal = {
      id: Date.now().toString(),
      date: today,
      time: timeStr,
      text: text.trim(),
      length: text.length,
      score: Math.floor(text.length * 0.5 + moodScore * 0.3),
      mood: moodScore,
      xp: Math.floor(text.length * 0.5) + 10,
      emotions: emotions
    };

    const updatedJournals = journals
      .filter(j => j.date !== today)
      .concat(newJournal);

    await AsyncStorage.setItem("journals", JSON.stringify(updatedJournals));

    Alert.alert("저장 완료!", "홈으로 이동합니다.", [
      { text: "확인", onPress: () => navigation.navigate("Today") }
    ]);
  } catch (error) {
    console.log("저장 에러:", error);
    Alert.alert("저장 실패", "다시 시도해주세요.");
  }
};


  return (
    <ScrollView 
      style={styles.container} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* 펫 상태 */}
      <View style={styles.petBox}>
        <Text style={styles.petName}>루미 Lv.{petLevel}</Text>
        <Text style={styles.petXp}>연속 {streak}일 🔥</Text>
        <Text style={styles.petXp}>예상 XP: +{Math.floor(text.length * 0.5) + 10}</Text>
      </View>

      {/* 감정 버튼 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기분 선택 (여러 개 가능)</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.emotionsRow}
        >
          {EMOTIONS.map((emotion) => (
            <TouchableOpacity
              key={emotion.key}
              style={[
                styles.emotionBtn,
                emotions[emotion.key] && styles.emotionBtnActive
              ]}
              onPress={() => toggleEmotion(emotion.key)}
            >
              <Text style={[
                styles.emotionText,
                emotions[emotion.key] && styles.emotionTextActive
              ]}>
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.moodScore}>
          기분 점수: {calcMoodScore()}점
        </Text>
      </View>

      {/* 일기 작성 */}
      <View style={styles.section}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="15자 이상 작성하세요..."
          multiline
          textAlignVertical="top"
          maxLength={2000}
        />
        <Text style={[
          styles.charCount,
          text.length < MIN_LENGTH && styles.charCountWarning
        ]}>
          {text.length}/{MIN_LENGTH}자 {text.length < MIN_LENGTH && "(15자 이상)"}
        </Text>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity
        style={[
          styles.saveBtn,
          isSaveDisabled() && styles.saveBtnDisabled
        ]}
        onPress={saveJournal}
        disabled={isSaveDisabled()}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.saveBtnText,
          isSaveDisabled() && styles.saveBtnTextDisabled
        ]}>
          {isSaveDisabled() 
            ? `${MIN_LENGTH - text.length}자 더` 
            : `💾 저장하기 (${text.length}/${MIN_LENGTH})`
          }
        </Text>
      </TouchableOpacity>

      {/* 홈 버튼 */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("Today")}
      >
        <Text style={styles.homeBtnText}>🏠 홈으로</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20
  },
  petBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e3f2fd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  petName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1976d2",
    marginBottom: 4
  },
  petXp: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600"
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16
  },
  emotionsRow: {
    flexDirection: "row",
    paddingVertical: 8
  },
  emotionBtn: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    minWidth: 80
  },
  emotionBtnActive: {
    backgroundColor: "#2196f3",
    borderColor: "#1976d2"
  },
  emotionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center"
  },
  emotionTextActive: {
    color: "white",
    fontWeight: "700"
  },
  moodScore: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#2196f3",
    textAlign: "center"
  },
  textInput: {
    fontSize: 16,
    minHeight: 200,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fafbfc",
    borderWidth: 1,
    borderColor: "#e9ecef",
    textAlignVertical: "top"
  },
  charCount: {
    textAlign: "right",
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "500"
  },
  charCountWarning: {
    color: "#f44336"
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  saveBtnDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0
  },
  saveBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800"
  },
  saveBtnTextDisabled: {
    color: "#999"
  },
  homeBtn: {
    backgroundColor: "#6c757d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  homeBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700"
  }
});
