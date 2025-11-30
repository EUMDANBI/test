import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, Animated 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function TodayJournalScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [journals, setJournals] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [showPet, setShowPet] = useState(false);

  // 앱 시작시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedJournals = await AsyncStorage.getItem("journals");
      const savedLevel = await AsyncStorage.getItem("level");
      const savedXp = await AsyncStorage.getItem("xp");
      const savedStreak = await AsyncStorage.getItem("streak");
      
      if (savedJournals) setJournals(JSON.parse(savedJournals));
      if (savedLevel) setLevel(parseInt(savedLevel));
      if (savedXp) setXp(parseInt(savedXp));
      if (savedStreak) setStreak(parseInt(savedStreak));
    } catch (e) {
      console.error(e);
    }
  };

  const saveJournal = async () => {
    console.log("📝 저장 버튼 클릭됨!"); 
    if (text.length < 8) {
      Alert.alert("알림", "일기는 최소 8글자 이상 작성해주세요!");
      return;
    }

    // 오늘 날짜 확인 (연속성 체크)
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    let bonusXp = 10; // 기본 XP
    let newStreak = streak;
    
    // 어제도 썼으면 연속 보너스
    const yesterdayJournal = journals.find(j => j.date === yesterday);
    if (yesterdayJournal) {
      newStreak += 1;
      bonusXp += 5 * newStreak; // 연속수만큼 보너스
    } else {
      newStreak = 1;
    }

    // 새 일기 저장
    const newJournal = {
      id: Date.now().toString(),
      date: today,
      text: text,
      score: Math.floor(text.length / 2), // 글자수/2 = 점수
      mood: Math.min(100, 25 + Math.floor(text.length / 5)), // 최대 100
      xp: bonusXp
    };

    const updatedJournals = [newJournal, ...journals];
    const newXp = xp + bonusXp;
    const newLevel = Math.floor(newXp / 100) + 1;

    // 레벨업 체크
    if (newLevel > level) {
      setLevel(newLevel);
      showLevelUp();
    }

    // 데이터 저장
    await AsyncStorage.multiSet([
      ["journals", JSON.stringify(updatedJournals)],
      ["level", newLevel.toString()],
      ["xp", newXp.toString()],
      ["streak", newStreak.toString()]
    ]);

    // 상태 업데이트
    setJournals(updatedJournals);
    setXp(newXp);
    setStreak(newStreak);
    setText("");
    showPetAnimation();
  };

  const showLevelUp = () => {
    Alert.alert(
      "🎉 레벨업!",
      `레벨 ${level + 1} 달성!\n연속 ${streak}일째`,
      [{ text: "좋아!", onPress: () => navigation.navigate("PetGrowth") }]
    );
  };

  const showPetAnimation = () => {
    setShowPet(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start(() => {
      setTimeout(() => setShowPet(false), 2000);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>오늘 일기</Text>
      
      {/* 맞춤법 검사기 스타일 입력바 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="오늘 기분이 어땠나요? 8글자 이상 작성해주세요..."
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
        <View style={styles.counter}>
          <Text style={[
            styles.countText, 
            text.length < 8 && styles.warningText
          ]}>
            {text.length}/1000 (최소 8자)
          </Text>
        </View>
      </View>

      {/* 현재 상태 표시 */}
      <View style={styles.status}>
        <Text style={styles.statusText}>레벨 {level} | XP {xp} | 연속 {streak}일</Text>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={saveJournal}>
        <Text style={styles.saveButtonText}>💾 저장하기</Text>
      </TouchableOpacity>

      {/* 펫 축하 애니메이션 */}
      {showPet && (
        <Animated.View style={[styles.pet, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.petText}>🥳 {streak > 1 ? '연속' : '첫'} 일기 축하!</Text>
          <Text style={styles.petText}>+{xp - (xp - 10)} XP 획득!</Text>
        </Animated.View>
      )}

      {/* 지난 일기 링크 */}
      <TouchableOpacity 
        style={styles.pastLink}
        onPress={() => navigation.navigate("Past")}
      >
        <Text style={styles.pastLinkText}>📖 지난 일기 보러가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#2c3e50", marginBottom: 20, textAlign: "center" },
  inputContainer: { 
    backgroundColor: "white", 
    borderRadius: 16, 
    padding: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 8 
  },
  textInput: { 
    fontSize: 16, 
    lineHeight: 24, 
    minHeight: 200, 
    borderWidth: 2, 
    borderColor: "#e9ecef", 
    borderRadius: 12, 
    padding: 16,
    backgroundColor: "#fafbfc"
  },
  counter: { alignItems: "flex-end", marginTop: 8 },
  countText: { fontSize: 14, color: "#6c757d" },
  warningText: { color: "#e74c3c" },
  status: { 
    backgroundColor: "#e3f2fd", 
    padding: 12, 
    borderRadius: 12, 
    alignItems: "center", 
    marginVertical: 20 
  },
  statusText: { fontSize: 16, fontWeight: "600", color: "#1976d2" },
  saveButton: { 
    backgroundColor: "#4caf50", 
    padding: 18, 
    borderRadius: 16, 
    alignItems: "center", 
    marginBottom: 20,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8 
  },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "700" },
  pet: { 
    backgroundColor: "#fff3cd", 
    padding: 20, 
    borderRadius: 16, 
    alignItems: "center", 
    marginVertical: 20,
    borderWidth: 3, 
    borderColor: "#ffeaa7" 
  },
  petText: { fontSize: 18, fontWeight: "700", color: "#856404" },
  pastLink: { 
    backgroundColor: "#f8f9fa", 
    padding: 12, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  pastLinkText: { fontSize: 16, color: "#6c757d", fontWeight: "500" }
});
