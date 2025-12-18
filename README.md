# 0. 프로젝트 홈
한 줄 소개: 감정 분석 + 응원 카드 + 펫 성장형 일기 앱 (MyPetApp)

대표 스크린샷
<img src = "https://github.com/user-attachments/assets/93084dd5-0e76-4537-adad-150adfa794bd" width="30%" height="40%">
<img src = "https://github.com/user-attachments/assets/459729e1-ff61-4859-a37e-20c5d20b6895" width="30%" height="40%">

빠른 링크

개요 / 사용자 플로우

화면별 정리

기술 스택 / 설치

데이터 구조 / 동기화

개발 로그 / TODO

# 1. 개요 / 사용자 플로우
프로젝트 목적
매일 일기를 쓰게 도와주는 감정/응원 중심 앱

사용자 감정 기록 + 응원 메시지 + 펫 성장 경험 제공

주요 사용자 플로우
Today → TodayJournal → Support → PhotoGallery / Past / Calendar / PetLog / EmotionAnalysis

앱 진입 시:

펫 상태 불러오기 (로컬 + 서버 동기화)

오늘 타임캡슐 편지 있으면 하루에 한 번 팝업

# 2. 화면별 정리
각 화면은 아래 형식으로 서브 페이지 만들기.

TodayScreen
역할: 오늘 메인 허브 + 펫 상태 카드

주요 내용:

펫 상태 카드: name, level, xp, maxXp, intimacy, mood, streak, imageKey

오늘 일기 쓰기, 지난 일기(Past), 달력(Calendar), 사진첩(PhotoGallery), 펫 로그(PetLog), 감정 분석(EmotionAnalysis)로 이동하는 버튼

특이 로직:

앱 진입 시:

syncPetFromServer()로 서버의 pet 데이터를 가져와 로컬(AsyncStorage "pet")과 상태에 반영

calcStreakFromJournals(journals)로 연속 작성일 계산 후 펫 streak 갱신

TodayJournalScreen (오늘 일기)
역할: 오늘 일기 작성 화면

주요 내용:

텍스트 입력, 글자 수, 저장 버튼

감정 선택 버튼들(슬픔, 분노, 불안, 차분, 기쁨, 사랑)

미래의 나에게 쓰는 타임캡슐 편지 입력 영역(옵션)

특이 로직:

저장 시:

journals에 오늘자 일기 추가/갱신 (AsyncStorage + 서버 동기화)

감정이 비어 있으면 감정 분석 API 호출

일기 길이/스트릭 기준 XP 계산 → pet 업데이트

SupportScreen (응원 카드)
역할: AI 응원 메시지 + 배경/음악 화면

주요 내용:

배경 이미지 + 카드형 응원 문장

감정 키워드 태그(#불안, #분노 등)

BGM 재생/정지 토글

특이 로직:

응원 메시지 큐(supportQueue) 재시도, 서버에서 최신 응원 문장 가져와 표시

PhotoGalleryScreen (사진첩)
역할: “응원 카드 사진첩” 화면

주요 내용:

photo_items를 그리드로 표시 (날짜, 배경 이미지, 응원 문장 요약)

카드 탭 시 해당 일기의 Support 화면으로 이동

PastScreen (지난 일기)
역할: 지금까지 쓴 일기 목록

주요 내용:

journals를 날짜 순으로 리스트 표시

각 항목에 날짜, 감정 아이콘/텍스트, 내용 일부 미리보기

탭 시 일기 상세/Support 화면으로 이동

CalendarScreen (달력)
역할: “달력으로 보는 기록/기분”

주요 내용:

한 달 달력에 일기 있는 날 표시

스트릭/연속 작성일에 따라 색 진하기 등으로 시각화

날짜 탭 시 해당 날짜의 일기 목록이나 Support로 이동

PetLogScreen (펫 로그)
역할: “펫 성장 기록/로그” 화면

주요 내용:

"pet" 상태(레벨, 총 XP, 연속 작성일 등)를 기준으로, 언제 XP를 얼마나 얻었는지 간단한 로그/리스트 표시

“몇 일 연속 작성 → 스트릭 보너스 XP” 정보 텍스트/간단 그래프 정리

사용자가 “최근에 얼마나 열심히 기록했는지”를 펫 성장 히스토리로 확인

EmotionAnalysisScreen (감정 분석 로그)
역할: “감정 테스트/자료 통계” 화면

주요 내용:

journals에 저장된 감정(기본 감정 + AI 분석 감정)을 집계

최근 7일/30일 감정 TOP3, 전체 감정 비율(슬픔/분노/불안/차분/기쁨/사랑 등)을 리스트 또는 차트로 표현

특정 감정 선택 시, 해당 감정이 기록된 일기 목록으로 이동해 일기/응원 카드 재확인

“연속으로 우울한 날”, “연속으로 평온한 날” 같은 감정 스트릭 보여주기

# 3. 기술 스택 / 설치
개발 환경(PC)
Node.js (LTS)

JDK 17

Android Studio (Android SDK 35, NDK 27.1.12297006, CMake 3.22.1)

Visual Studio Code

실제 Android 기기 또는 에뮬레이터

프로젝트 생성 / 실행
프로젝트 생성:

npx create-expo-app .

일반 실행(Expo Go 또는 개발 빌드용):

npx expo start

주요 라이브러리
로컬 저장:

npx expo install @react-native-async-storage/async-storage

네비게이션:

npm install @react-navigation/native @react-navigation/native-stack

npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context

애니메이션 / 오디오:

npx expo install lottie-react-native

npx expo install expo-av

(선택) 개발 빌드:

npx expo install expo-dev-client

npm install -g eas-cli 후 eas build --platform android --profile development

# 4. 데이터 구조 / 핵심 유틸 함수
주요 저장 키
journals: 날짜별 일기, 감정, 타임캡슐, 메타데이터

pet: 펫 상태 (name, level, xp, maxXp, intimacy, mood, streak, imageKey 등)

photo_items: 응원 카드/사진첩용 아이템 리스트

supportQueue: 응원 메시지 재전송 큐

lastTimeCapsuleShownDate: 오늘 타임캡슐 팝업 표시 여부

유틸 함수 요약
getTodayLocalDate()

오늘 날짜를 YYYY-MM-DD 문자열로 반환.

calcStreakFromJournals(journals)

journals의 날짜를 기준으로, 오늘부터 거꾸로 “중간에 빈 날 나오기 전까지” 연속 작성일을 세고,

(오늘 포함 연속일 - 1)을 streak 숫자로 반환.

showTodayTimeCapsuleOnce(navigation)

오늘 날짜의 openDate를 가진 타임캡슐이 있으면, 그중 하나를 랜덤으로 골라 Alert로 보여줌.

닫을 때 lastTimeCapsuleShownDate를 오늘로 저장해서 “하루에 한 번만” 뜨도록 제어.

syncPetFromServer()

GET /pet 호출 → 서버 pet 데이터 수신.

maxXp 없으면 100, imageKey 없으면 기본값으로 보정.

AsyncStorage "pet"에 저장하고, setPet으로 TodayScreen의 펫 상태를 갱신.

# 5. 렌더링 / useEffect 메모
렌더링:

현재 state/props를 기준으로 UI 모양을 계산하고, 실제 화면에 반영하는 과정.

TodayScreen에서 pet 상태가 바뀌면, 렌더링이 다시 일어나 펫 카드 UI가 새 값으로 그려짐.

useEffect:

“렌더링이 끝난 뒤에 실행할 작업”을 등록하는 훅.

예:

화면 처음 마운트될 때 syncPetFromServer() 호출.

화면 포커스 시 showTodayTimeCapsuleOnce() 호출.

# 6. 개발 로그 / TODO
개발 로그(테이블): 날짜 / 작업 / 관련 화면 / 상태(진행중·완료)

자주 마주친 에러와 메모:

No development build (com.mypetapp) → 개발 빌드 미설치, EAS로 빌드 후 설치 필요.

PowerShell에서 eas 인식 안 됨 → npm install -g eas-cli 후 새 터미널 열기.

TODO 예시:

EmotionAnalysisScreen 시각화 강화

펫 이미지 종류/스킨 추가

통계/그래프 디자인 개선

배포용 빌드(EAS) 준비
