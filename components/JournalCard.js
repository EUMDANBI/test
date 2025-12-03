import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function JournalCard({
  date,
  time,
  score,
  mood,
  xp,
  onDelete,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.date}>{date}</Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>

      <Text style={styles.text}>
        점수: {score}점 · 기분: {mood}점 · XP +{xp}
      </Text>
      <Text style={styles.link}>작성한 내용 보기</Text>

      {onDelete && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => {
            console.log("❌ 카드 안에서 delete 버튼 눌림");
            onDelete();
          }}
        >
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// styles는 네가 쓰던 그대로 두면 됨


const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  date: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2196f3",
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4e4e4eff",
    //alignSelf: "center"
  },
  text: {
    color: "#555",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500"
  },
  link: {
    color: "#2196f3",
    textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: "600"
  },
  deleteBtn: {
    position: "absolute",
    right: 16,   // 카드 오른쪽에서 16px 떨어진 위치
    bottom: 16,   // 카드 아래쪽에서 16px 떨어진 위치
    backgroundColor: "#ff5252",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14
  }
});
