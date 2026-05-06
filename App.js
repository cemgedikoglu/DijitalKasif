import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { lessons } from "./data/lessons";

const screens = {
  HOME: "HOME",
  LESSON: "LESSON",
  QUIZ: "QUIZ",
  RESULT: "RESULT"
};

export default function App() {
  const [screen, setScreen] = useState(screens.HOME);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const pulse = useRef(new Animated.Value(1)).current;

  const totalQuestions = selectedLesson?.quiz.length || 0;
  const totalCards = selectedLesson?.cards.length || 0;

  const overallProgress = useMemo(() => {
    const completedCount = Object.keys(completedLessons).length;
    return lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100);
  }, [completedLessons]);

  function startLesson(lesson) {
    setSelectedLesson(lesson);
    setCardIndex(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setScreen(screens.LESSON);
  }

  function goHome() {
    setScreen(screens.HOME);
    setSelectedLesson(null);
    setCardIndex(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
  }

  function nextCard() {
    if (cardIndex < totalCards - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setScreen(screens.QUIZ);
      setQuestionIndex(0);
      setSelectedOption(null);
    }
  }

  function chooseOption(index) {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const currentQuestion = selectedLesson.quiz[questionIndex];
    const isCorrect = index === currentQuestion.answerIndex;

    if (isCorrect) {
      setScore(score + 1);
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 120,
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true
        })
      ]).start();
    }
  }

  function nextQuestion() {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption(null);
    } else {
      setCompletedLessons((prev) => ({ ...prev, [selectedLesson.id]: true }));
      setScreen(screens.RESULT);
    }
  }

  if (screen === screens.HOME) {
    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <Text style={styles.appIcon}>🚀</Text>
            <Text style={styles.appTitle}>LearNexus</Text>
            <Text style={styles.appSubtitle}>
              Ortaokul öğrencileri için Bilgisayar Ağları ve İşletim Sistemleri konularını oyunlaştırılmış biçimde öğrenme uygulaması.
            </Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Genel İlerleme</Text>
              <Text style={styles.progressText}>%{overallProgress}</Text>
            </View>
            <ProgressBar value={overallProgress} color="#16A34A" />
            <Text style={styles.smallText}>
              Tamamlanan görevler: {Object.keys(completedLessons).length}/{lessons.length}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Öğrenme Görevleri</Text>
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              style={({ pressed }) => [
                styles.lessonCard,
                { backgroundColor: lesson.softColor, borderColor: lesson.color },
                pressed && styles.pressed
              ]}
              onPress={() => startLesson(lesson)}
            >
              <View style={styles.lessonTopRow}>
                <View style={[styles.roundIcon, { backgroundColor: lesson.color }]}>
                  <Text style={styles.roundIconText}>{lesson.icon}</Text>
                </View>
                <View style={styles.lessonTextArea}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.courseText}>{lesson.course}</Text>
                </View>
                <Text style={styles.checkText}>{completedLessons[lesson.id] ? "✓" : "›"}</Text>
              </View>
              <Text style={styles.lessonObjective}>{lesson.objective}</Text>
            </Pressable>
          ))}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Proje kapsamı</Text>
            <Text style={styles.infoText}>• Bilgisayar Ağları: Cybersecurity / Siber Güvenlik</Text>
            <Text style={styles.infoText}>• İşletim Sistemleri: File-System Interface / Dosya Sistemi</Text>
            <Text style={styles.infoText}>• Hedef kitle: Ortaokul öğrencileri</Text>
          </View>
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.LESSON && selectedLesson) {
    const card = selectedLesson.cards[cardIndex];
    const progress = Math.round(((cardIndex + 1) / totalCards) * 100);

    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title={selectedLesson.shortTitle} onBack={goHome} />

          <View style={[styles.topicHeader, { backgroundColor: selectedLesson.softColor }]}> 
            <Text style={styles.bigEmoji}>{selectedLesson.icon}</Text>
            <Text style={styles.topicTitle}>{selectedLesson.storyTitle}</Text>
            <Text style={styles.courseText}>{selectedLesson.course}</Text>
          </View>

          <ProgressBar value={progress} color={selectedLesson.color} />
          <Text style={styles.smallText}>Konu kartı {cardIndex + 1}/{totalCards}</Text>

          <Animated.View style={[styles.contentCard, { transform: [{ scale: pulse }] }]}> 
            <Text style={styles.cardHeading}>{card.heading}</Text>
            <Text style={styles.cardBody}>{card.body}</Text>
            <View style={[styles.analogyBox, { backgroundColor: selectedLesson.softColor }]}> 
              <Text style={styles.analogyLabel}>Günlük hayat benzetmesi</Text>
              <Text style={styles.analogyText}>{card.analogy}</Text>
            </View>
          </Animated.View>

          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>{selectedLesson.mission.title}</Text>
            <Text style={styles.missionText}>{selectedLesson.mission.text}</Text>
            <Text style={styles.missionAnswer}>Önerilen davranış: {selectedLesson.mission.correctAction}</Text>
          </View>

          <PrimaryButton
            title={cardIndex < totalCards - 1 ? "Sonraki anlatım" : "Sorulara geç"}
            color={selectedLesson.color}
            onPress={nextCard}
          />
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.QUIZ && selectedLesson) {
    const question = selectedLesson.quiz[questionIndex];
    const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100);
    const isAnswered = selectedOption !== null;
    const isCorrect = selectedOption === question.answerIndex;

    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title="Bilgi Kontrolü" onBack={goHome} />
          <View style={[styles.quizHeader, { backgroundColor: selectedLesson.softColor }]}> 
            <Text style={styles.quizSmallTitle}>{selectedLesson.title}</Text>
            <Text style={styles.questionCounter}>Soru {questionIndex + 1}/{totalQuestions}</Text>
            <ProgressBar value={progress} color={selectedLesson.color} />
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          {question.options.map((option, index) => {
            const correct = index === question.answerIndex;
            const selected = index === selectedOption;
            let optionStyle = styles.optionButton;
            let optionTextStyle = styles.optionText;

            if (isAnswered && correct) {
              optionStyle = [styles.optionButton, styles.correctOption];
              optionTextStyle = [styles.optionText, styles.optionTextSelected];
            } else if (isAnswered && selected && !correct) {
              optionStyle = [styles.optionButton, styles.wrongOption];
              optionTextStyle = [styles.optionText, styles.optionTextSelected];
            }

            return (
              <Pressable
                key={`${option}-${index}`}
                style={({ pressed }) => [optionStyle, pressed && !isAnswered && styles.pressed]}
                onPress={() => chooseOption(index)}
              >
                <Text style={optionTextStyle}>{String.fromCharCode(65 + index)}. {option}</Text>
              </Pressable>
            );
          })}

          {isAnswered && (
            <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}> 
              <Text style={styles.feedbackTitle}>{isCorrect ? "Doğru cevap!" : "Tekrar düşünelim"}</Text>
              <Text style={styles.feedbackText}>{question.feedback}</Text>
            </View>
          )}

          {isAnswered && (
            <PrimaryButton
              title={questionIndex < totalQuestions - 1 ? "Sonraki soru" : "Sonucu gör"}
              color={selectedLesson.color}
              onPress={nextQuestion}
            />
          )}
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.RESULT && selectedLesson) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const successMessage = percentage >= 70 ? "Harika iş çıkardın!" : "Güzel başlangıç, tekrar deneyebilirsin.";

    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.resultCard, { backgroundColor: selectedLesson.softColor }]}> 
            <Text style={styles.resultEmoji}>{percentage >= 70 ? "🏆" : "🌱"}</Text>
            <Text style={styles.resultTitle}>{successMessage}</Text>
            <Text style={styles.resultScore}>{score}/{totalQuestions}</Text>
            <Text style={styles.resultText}>{selectedLesson.shortTitle} görevini tamamladın.</Text>
            <ProgressBar value={percentage} color={selectedLesson.color} />
            <Text style={styles.progressText}>Başarı: %{percentage}</Text>
          </View>

          <PrimaryButton title="Ana sayfaya dön" color={selectedLesson.color} onPress={goHome} />
          <SecondaryButton title="Bu görevi tekrar çöz" onPress={() => startLesson(selectedLesson)} />
        </ScrollView>
      </AppShell>
    );
  }

  return null;
}

function AppShell({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {children}
    </SafeAreaView>
  );
}

function TopBar({ title, onBack }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <Text style={styles.topTitle}>{title}</Text>
      <View style={styles.backButtonPlaceholder} />
    </View>
  );
}

function ProgressBar({ value, color }) {
  return (
    <View style={styles.progressOuter}>
      <View style={[styles.progressInner, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

function PrimaryButton({ title, color, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.primaryButton, { backgroundColor: color }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function SecondaryButton({ title, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  hero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
    alignItems: "center"
  },
  appIcon: {
    fontSize: 54,
    marginBottom: 8
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center"
  },
  appSubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center"
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12
  },
  progressText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 8
  },
  progressOuter: {
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 8
  },
  progressInner: {
    height: "100%",
    borderRadius: 99
  },
  smallText: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2
  },
  lessonCard: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14
  },
  lessonTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  roundIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  roundIconText: {
    fontSize: 28
  },
  lessonTextArea: {
    flex: 1
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A"
  },
  courseText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4
  },
  checkText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A"
  },
  lessonObjective: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 21
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8
  },
  infoText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  backButtonPlaceholder: {
    width: 42,
    height: 42
  },
  backText: {
    fontSize: 34,
    lineHeight: 36,
    color: "#0F172A"
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A"
  },
  topicHeader: {
    borderRadius: 28,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  bigEmoji: {
    fontSize: 58,
    marginBottom: 6
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center"
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 25,
    color: "#334155"
  },
  analogyBox: {
    marginTop: 18,
    borderRadius: 18,
    padding: 16
  },
  analogyLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6
  },
  analogyText: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 22
  },
  missionCard: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16
  },
  missionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#9A3412",
    marginBottom: 8
  },
  missionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#7C2D12",
    marginBottom: 8
  },
  missionAnswer: {
    fontSize: 14,
    lineHeight: 21,
    color: "#9A3412",
    fontWeight: "700"
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  },
  secondaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1"
  },
  secondaryButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900"
  },
  quizHeader: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  quizSmallTitle: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8
  },
  questionCounter: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  questionText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 28
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1"
  },
  optionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    lineHeight: 22
  },
  correctOption: {
    backgroundColor: "#16A34A",
    borderColor: "#15803D"
  },
  wrongOption: {
    backgroundColor: "#DC2626",
    borderColor: "#B91C1C"
  },
  optionTextSelected: {
    color: "#FFFFFF"
  },
  feedbackBox: {
    borderRadius: 20,
    padding: 16,
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1
  },
  feedbackCorrect: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC"
  },
  feedbackWrong: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5"
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4
  },
  feedbackText: {
    color: "#334155",
    lineHeight: 21
  },
  resultCard: {
    borderRadius: 30,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 20,
    marginBottom: 18
  },
  resultEmoji: {
    fontSize: 70,
    marginBottom: 10
  },
  resultTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8
  },
  resultScore: {
    fontSize: 48,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4
  },
  resultText: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  }
});
