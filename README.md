# 0. 프로젝트 홈
>#### 한 줄 소개: 감정 분석 + 응원 카드 + 펫 성장형 일기 앱 (MyPetApp)

대표 스크린샷

<img src = "https://github.com/user-attachments/assets/93084dd5-0e76-4537-adad-150adfa794bd" width="30%" height="40%">
<img src = "https://github.com/user-attachments/assets/459729e1-ff61-4859-a37e-20c5d20b6895" width="30%" height="40%">

빠른 링크
null

#### 개요 / 사용자 플로우
1. 오늘의 나의 감정 및 경험을 기반하여 하루 일기를 작성한다.
2. 하루 일기에서 쓰여진 내용과 기분 선택을 통해 감정을 분석해준다.
3. 감정에 따라 알맞는 BGM 및 배경들이 나오고 분석한 나의 감정들과 그에 알맞는 말들이 나온다.

#### 화면별 정리
+ 홈화면 : 펫 이미지 수정 가능, [일기 쓰기, 지난 일기, 달력 보기, 사진첩, 펫 로그] 버튼
+ 일기 쓰기 : 일기를 쓰면 감정을 분석해 위로의 말과 기분에 맞는 배경과 BGM 제공, 저장, 미래의 나에게 편지를 남길 수 있다.
+ 지난 일기 : 일기를 썼던 날짜와 시간을 확인 하며 그날 어떤 느낌의 감정이였는지 확인이 가능하고 여러개 선택해 삭제가 가능 하다.
+ 일기 상세 : 일기를 썼던 날짜와 시간, 내용, 위로 / 응원 문구 및 사진을 확인 할 수 있다.
   이전 일기 혹은 다음 일기도 있으면 확인 가능하다.
+ 달력 보기 : 일기를 언제 썻는지 얼마나 자주 썻는지 확인 할 수 있다.
+ 사진첩 : 일기 쓰고 위로/응원 글을 받았던 사진들이 배열 되어 있어 누르면 다시 확인 가능하다.
+ 펫 로그 : 펫 이름을 수정 할 수 있고, 최근 감정이 어땟는지 활동은 얼마나 했었는지 그리고 일기는 얼마나 썻었는지를 확인 할 수 있다.
  [감정 테스트 기록 초기화, 펫 상태 초기화, 지난 일기, 감정 분석 로그] 버튼
+ 일기 감정의 통계를 볼 수 있고 감정 태그 사용 횟수를 통해 본인이 어떤 감정들을 잘 느꼈는지 살펴볼 수 있다.
자유 텍스트 감정 테스트로 본인의 지금 상태를 적어 어떤 감정인지 AI에게 분석을 요구하고 결과를 볼 수 있다.

## 기술 스택 / 설치
### 개발 환경(PC)

Node.js (LTS)

JDK 17

Android Studio (Android SDK 35, NDK 27.1.12297006, CMake 3.22.1)

Visual Studio Code

### 실제 Android 기기 또는 에뮬레이터

#### 프로젝트 생성 / 실행
>프로젝트 생성:

npx create-expo-app .

>일반 실행(Expo Go 또는 개발 빌드용):

npx expo start

#### 주요 라이브러리
>로컬 저장:

npx expo install @react-native-async-storage/async-storage

>네비게이션:

npm install @react-navigation/native @react-navigation/native-stack

npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context

>애니메이션 / 오디오:

npx expo install lottie-react-native

npx expo install expo-av

>(선택) 개발 빌드:

npx expo install expo-dev-client

npm install -g eas-cli 후 eas build --platform android --profile development

### 데이터 구조 / 동기화

 #### 클라이언트 화면 [React Native 앱 (Expo)]
 
 ├─ UI Screen 레이어
 
 ├─ AsyncStorage (로컬 데이터)
 
 └─ API Client (fetch, API_BASE)
 
#### 백엔드 서버 (Node.js + Express + TypeScript)

   ├─ API 라우터 (/journals, /pet, /ai-support, /support-message, /analyze, /health)
   
   ├─ 도메인 서비스 (Journal / Pet / Support / Emotion)
   
   ├─ OpenAI 클라이언트 (callOpenAIChat)
   
   └─ 인메모리 저장소(Map)  ← (추후 DB로 교체 예정)
   
#### [OpenAI  API]
 - gpt-4.1-mini 모델로 감정 분석/응원 생성

#### 개발 로그 / TODO
1. 웹/모바일 동기화 버그 정리: 사진첩, 큐(syncSupportQueue), 
펫 동기화 404/500 같은 자잘한 로그를 한 번에 싹 정리.

2. UX 폴리싱: 로딩 상태·에러 문구·토스트, 진입 애니메이션, 
감정/펫 설명 텍스트를 조금 더 따듯한 친구나 사람처럼 설정하여 완성도 올리기.

3. 감정 통계/리포트 화면: 한 달 감정 비율, 평균 기분 점수, 
자주 등장한 키워드 등을 그래프로 보여주기.

4. 추천 루틴: “이럴 때 이런 행동 해보자” 같은 간단한 행동 제안
(산책, 수면, 스트레칭 등)을 감정에 맞춰 붙이는 기능.

5. DB: DB를 이용하여 더 다양한 상황을 예측하여 사용자에게 원활한 서비스 제공

# 1. 개요 / 사용자 플로우
### 프로젝트 목적
일기 써서 위로/응원 + 펫 성장 + 감정 분석을 함으로서 힐링하는 것

사용자 감정 기록 + 응원 메시지 + 펫 성장 경험 제공

### 주요 사용자 플로우
홈 화면(Today) → 일기 쓰기(TodayJournal) → 위로/응원(Support) 

→ 사진첩(PhotoGallery) / 지난 일기(Past) / 달력(Calendar) / 펫 로그(PetLog) / 감정 분석 로그(EmotionAnalysis)

앱 진입 시:

펫 상태 불러오기 (로컬 + 서버 동기화)

오늘 타임캡슐 편지 있으면 일기 쓰기 전 하루에 한 번 팝업

# 2. 화면별 정리
각 화면은 아래 형식으로 서브 페이지 만들기.

### 홈 화면(TodayScreen)

역할: 오늘 메인 허브 + 펫 상태 카드

주요 내용:

+ 펫 상태 카드: 이름(name), 레벨(level), 경험치(xp), 레벨업하기 위한 필요경험치(maxXp), 친밀도(intimacy), 기분(mood), 일기 하루하루 연속적으로 쓴 횟수(streak), 펫 이미지 변환하기 위해 필요한 키값(imageKey)

+ 오늘 일기 쓰기, 지난 일기(Past), 달력(Calendar), 사진첩(PhotoGallery), 펫 로그(PetLog), 감정 분석(EmotionAnalysis)로 이동하는 버튼

특이 로직:

* 앱 진입 시:

 > 1. syncPetFromServer()로 서버의 pet 데이터를 가져와 로컬(AsyncStorage "pet")과 상태에 반영&nbsp; __= 펫 상태 동기화__
 > 2. calcStreakFromJournals(journals)로 연속 작성일 계산 후 펫 streak 갱신&nbsp; __= 연속 작성일 동기화__

### TodayJournalScreen (오늘 일기)

역할: 오늘 일기 작성 화면

주요 내용:

 + [텍스트 입력, 글자 수, 저장] 버튼

 + 감정 선택 버튼들(슬픔, 분노, 불안, 차분, 기쁨, 사랑)

 + 미래의 나에게 쓰는 타임캡슐 편지 입력 영역(옵션)

특이 로직:

 + 저장 시:

> 1. journals에 오늘자 일기 추가/갱신 (AsyncStorage + 서버 동기화)&nbsp; __= 일기장에 일기(내부저장소 + 서버) 동기화__
> 2. 감정이 비어 있으면 감정 분석 API 호출&nbsp; __= AI가 일기 내용 토대로 감정 분석 후 감정 자동 선택 기능__
> 3. 일기 길이/스트릭 기준 XP 계산 → pet 업데이트&nbsp; __= 펫 경험치 동기화__

### SupportScreen (응원 카드)

역할: AI 응원 메시지 + 배경사진/음악(BGM) 화면

주요 내용:

+ 배경 이미지 + 카드형 응원 문장

+ 감정 키워드 태그(#불안, #분노 등)

+ BGM 재생/정지 토글

특이 로직:

 &nbsp; &nbsp;- 응원 메시지 큐(supportQueue) 재시도, 서버에서 최신 응원 문장 가져와 표시

### PhotoGalleryScreen (사진첩)

역할: “응원 카드 사진첩” 화면

주요 내용:

+ photo_items를 그리드로 표시 (날짜, 배경 이미지 요약 화면)

+ 카드 탭 시 해당 일기의 Support 화면으로 이동 (해당 날짜에 받은 위로/응원 카드 확인 가능)

### PastScreen (지난 일기)

역할: 지금까지 쓴 일기 목록

주요 내용:

+ journals를 날짜 순으로 리스트 표시 (일기장 내용을 날짜 순으로..)

+ 각 항목에 날짜, 감정 아이콘/텍스트, 내용 일부 미리보기

+ 탭 시 일기 상세 화면으로 이동
  
### JournalDetailScreen (일기 상세)

역할: 해당 날짜에 쓴 일기 내용과 받았던 내용 표시

주요 내용:

+ [날짜, 기분 점수, 얻었던 경험치 양, 일기 내용, 위로/응원 카드(BGM = X)] 표시
  
+ 수정, 삭제 기능 (해당 내용을 누르면 [수정, 삭제] 버튼 활성화)

### CalendarScreen (달력)

역할: “달력으로 보는 기록”

주요 내용:

+ 한 달 달력에 일기 있는 날 표시

+ 연속 작성일에 따라 색 진하기 등으로 시각화

+ 날짜 탭 시 해당 날짜의 일기 상세 화면으로 이동

### PetLogScreen (펫 로그)

역할: “펫 성장 기록/로그” 화면

주요 내용:

+ "pet" 상태(레벨, 총 XP, 연속 작성일 등)를 기준으로, 언제 XP를 얼마나 얻었는지 간단한 로그 표시

+ “몇 일 연속 작성 → 연속 작성 보너스 XP” 정보 텍스트/간단 그래프 정리

+ 사용자가 “최근에 얼마나 열심히 기록했는지”를 펫 성장 히스토리로 확인

### EmotionAnalysisScreen (감정 분석 로그)

역할: “감정 테스트/자료 통계” 화면

주요 내용:

+ journals(일기장)에 저장된 감정(기본 감정 + AI 분석 감정)을 집계

+ 최근 7일 감정 점수, 전체 감정 선택 횟 수(슬픔/분노/불안/차분/기쁨/사랑) 리스트 표시

+ “연속으로 우울한 날”, “연속으로 평온한 날” 같은 감정 스트릭 보여주기

# 3. 기술 스택 / 설치

### 개발 환경(PC)

Node.js (LTS)

JDK 17

Android Studio (Android SDK 35, NDK 27.1.12297006, CMake 3.22.1)

Visual Studio Code

### 실제 Android 기기 또는 에뮬레이터

#### 프로젝트 생성 / 실행
>프로젝트 생성:

npx create-expo-app .

>일반 실행(Expo Go 또는 개발 빌드용):

npx expo start

#### 주요 라이브러리
>로컬 저장:

npx expo install @react-native-async-storage/async-storage

>네비게이션:

npm install @react-navigation/native @react-navigation/native-stack

npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context

>애니메이션 / 오디오:

npx expo install lottie-react-native

npx expo install expo-av

>(선택) 개발 빌드:

npx expo install expo-dev-client

npm install -g eas-cli 후 eas build --platform android --profile development

# 4. 데이터 구조 / 핵심 유틸 함수

### 주요 저장 키

journals: 날짜별 일기, 감정, 타임캡슐, 메타데이터

pet: 펫 상태 (name, level, xp, maxXp, intimacy, mood, streak, imageKey 등)

photo_items: 응원 카드/사진첩용 아이템 리스트

supportQueue: 응원 메시지 재전송 큐

lastTimeCapsuleShownDate: 오늘 타임캡슐 팝업 표시 여부

### 유틸 함수 요약
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
