
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { lessons } from "./data/lessons";

const screens = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  HOME: "HOME",
  LESSON: "LESSON",
  QUIZ: "QUIZ",
  RESULT: "RESULT",
  PROFILE: "PROFILE",
  BADGES: "BADGES"
};

export default function App() {
  const [screen, setScreen] = useState(screens.LOGIN);
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const [lessonScores, setLessonScores] = useState({});
  const pulse = useRef(new Animated.Value(1)).current;

  const totalQuestions = selectedLesson?.quiz.length || 0;
  const totalCards = selectedLesson?.cards.length || 0;

  const completedCount = Object.keys(completedLessons).length;

  const overallProgress = useMemo(() => {
    return lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100);
  }, [completedCount]);

  const totalScore = useMemo(() => {
    return Object.values(lessonScores).reduce((sum, item) => sum + item.score, 0);
  }, [lessonScores]);

  const earnedBadges = useMemo(() => {
    const badges = [];

    if (currentUser) {
      badges.push({
        id: "welcome",
        icon: "👋",
        title: "Hoş Geldin Rozeti",
        description: "LearNexus uygulamasına giriş yaptın."
      });
    }

    if (completedLessons.security) {
      badges.push({
        id: "security",
        icon: "🛡️",
        title: "Siber Güvenlik Rozeti",
        description: "Siber Güvenlik öğrenme görevini tamamladın."
      });
    }

    if (completedLessons.filesystem) {
      badges.push({
        id: "filesystem",
        icon: "📁",
        title: "Dosya Sistemi Rozeti",
        description: "Dosya Sistemi Arayüzü öğrenme görevini tamamladın."
      });
    }

    if (overallProgress === 100) {
      badges.push({
        id: "complete",
        icon: "🏆",
        title: "Tüm Görevler Tamamlandı",
        description: "Uygulamadaki tüm öğrenme görevlerini bitirdin."
      });
    }

    return badges;
  }, [currentUser, completedLessons, overallProgress]);

  function handleLogin() {
    const name = loginName.trim() || "Öğrenci";
    setCurrentUser({
      name,
      username: name
    });
    setLoginName("");
    setLoginPassword("");
    setScreen(screens.HOME);
  }

  function handleRegister() {
    const name = registerName.trim() || "Yeni Öğrenci";
    const username = registerUsername.trim() || "ogrenci";
    setCurrentUser({
      name,
      username
    });
    setRegisterName("");
    setRegisterUsername("");
    setRegisterPassword("");
    setScreen(screens.HOME);
  }

  function logout() {
    setMenuOpen(false);
    setCurrentUser(null);
    setSelectedLesson(null);
    setCardIndex(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setScreen(screens.LOGIN);
  }

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function goHome() {
    setMenuOpen(false);
    setScreen(screens.HOME);
    setSelectedLesson(null);
    setCardIndex(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
  }

  function goProfile() {
    setMenuOpen(false);
    setScreen(screens.PROFILE);
  }

  function goBadges() {
    setMenuOpen(false);
    setScreen(screens.BADGES);
  }

  function startLesson(lesson) {
    setMenuOpen(false);
    setSelectedLesson(lesson);
    setCardIndex(0);
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setScreen(screens.LESSON);
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
      setScore((prev) => prev + 1);
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.04,
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
      setLessonScores((prev) => ({
        ...prev,
        [selectedLesson.id]: {
          score,
          total: totalQuestions
        }
      }));
      setScreen(screens.RESULT);
    }
  }

  if (screen === screens.LOGIN) {
    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.authScroll}>
          <View style={styles.authCard}>
            <Image source={require("./assets/logo.png")} style={styles.authLogo} />
            <Text style={styles.appTitle}>LearNexus</Text>
            <Text style={styles.appSubtitle}>
              Ortaokul öğrencileri için mobil öğrenme uygulaması.
            </Text>

            <Text style={styles.authTitle}>Giriş Yap</Text>

            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adı"
              value={loginName}
              onChangeText={setLoginName}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />

            <PrimaryButton title="Giriş Yap" color="#2563EB" onPress={handleLogin} />

            <Pressable style={styles.authLinkButton} onPress={() => setScreen(screens.REGISTER)}>
              <Text style={styles.authLinkText}>Hesabın yok mu? Kayıt ol</Text>
            </Pressable>
          </View>
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.REGISTER) {
    return (
      <AppShell>
        <ScrollView contentContainerStyle={styles.authScroll}>
          <View style={styles.authCard}>
            <Image source={require("./assets/logo.png")} style={styles.authLogo} />
            <Text style={styles.appTitle}>LearNexus</Text>
            <Text style={styles.appSubtitle}>
              Kendi öğrenme profilini oluştur ve görevleri tamamla.
            </Text>

            <Text style={styles.authTitle}>Kayıt Ol</Text>

            <TextInput
              style={styles.input}
              placeholder="Ad soyad"
              value={registerName}
              onChangeText={setRegisterName}
            />

            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adı"
              value={registerUsername}
              onChangeText={setRegisterUsername}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={registerPassword}
              onChangeText={setRegisterPassword}
              secureTextEntry
            />

            <PrimaryButton title="Kayıt Ol ve Başla" color="#16A34A" onPress={handleRegister} />

            <Pressable style={styles.authLinkButton} onPress={() => setScreen(screens.LOGIN)}>
              <Text style={styles.authLinkText}>Zaten hesabın var mı? Giriş yap</Text>
            </Pressable>
          </View>
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.HOME) {
    return (
      <AppShell>
        <SideMenu
          visible={menuOpen}
          user={currentUser}
          onClose={closeMenu}
          onHome={goHome}
          onProfile={goProfile}
          onBadges={goBadges}
          onLogout={logout}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title="Ana Sayfa" onMenu={openMenu} />

          <View style={styles.hero}>
            <Image source={require("./assets/logo.png")} style={styles.logoImage} />
            <Text style={styles.appTitle}>LearNexus</Text>
            <Text style={styles.appSubtitle}>
              Bilgisayar Ağları ve İşletim Sistemleri konularını adım adım öğren.
            </Text>
          </View>

          <View style={styles.quickActions}>
            <Pressable style={styles.quickButton} onPress={goProfile}>
              <Text style={styles.quickIcon}>👤</Text>
              <Text style={styles.quickText}>Profilim</Text>
            </Pressable>

            <Pressable style={styles.quickButton} onPress={goBadges}>
              <Text style={styles.quickIcon}>🏅</Text>
              <Text style={styles.quickText}>Rozetlerim</Text>
            </Pressable>

            <Pressable style={styles.quickButton} onPress={logout}>
              <Text style={styles.quickIcon}>🚪</Text>
              <Text style={styles.quickText}>Çıkış</Text>
            </Pressable>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Genel İlerleme</Text>
              <Text style={styles.progressText}>%{overallProgress}</Text>
            </View>
            <ProgressBar value={overallProgress} color="#16A34A" />
            <Text style={styles.smallText}>
              Tamamlanan görevler: {completedCount}/{lessons.length}
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
            <Text style={styles.infoText}>• Bilgisayar Ağları: Siber Güvenlik</Text>
            <Text style={styles.infoText}>• İşletim Sistemleri: Dosya Sistemi Arayüzü</Text>
            <Text style={styles.infoText}>• Hedef kitle: Ortaokul öğrencileri</Text>
          </View>
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.PROFILE) {
    return (
      <AppShell>
        <SideMenu
          visible={menuOpen}
          user={currentUser}
          onClose={closeMenu}
          onHome={goHome}
          onProfile={goProfile}
          onBadges={goBadges}
          onLogout={logout}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title="Profilim" onBack={goHome} onMenu={openMenu} />

          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>👤</Text>
            </View>

            <Text style={styles.profileName}>{currentUser?.name || "Öğrenci"}</Text>
            <Text style={styles.profileUsername}>@{currentUser?.username || "ogrenci"}</Text>

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatBox}>
                <Text style={styles.profileStatNumber}>{completedCount}</Text>
                <Text style={styles.profileStatLabel}>Tamamlanan</Text>
              </View>

              <View style={styles.profileStatBox}>
                <Text style={styles.profileStatNumber}>{totalScore}</Text>
                <Text style={styles.profileStatLabel}>Toplam Puan</Text>
              </View>

              <View style={styles.profileStatBox}>
                <Text style={styles.profileStatNumber}>{earnedBadges.length}</Text>
                <Text style={styles.profileStatLabel}>Rozet</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Öğrenme durumu</Text>
            <Text style={styles.infoText}>Genel ilerleme: %{overallProgress}</Text>
            <Text style={styles.infoText}>Tamamlanan görev: {completedCount}/{lessons.length}</Text>
            <Text style={styles.infoText}>Sonraki hedef: Tüm görevleri tamamlayıp rozetleri kazanmak.</Text>
          </View>

          <SecondaryButton title="Ana sayfaya dön" onPress={goHome} />
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.BADGES) {
    return (
      <AppShell>
        <SideMenu
          visible={menuOpen}
          user={currentUser}
          onClose={closeMenu}
          onHome={goHome}
          onProfile={goProfile}
          onBadges={goBadges}
          onLogout={logout}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title="Rozetlerim" onBack={goHome} onMenu={openMenu} />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Kazanılan Rozetler</Text>
            <Text style={styles.infoText}>
              Görevleri tamamladıkça yeni rozetler kazanırsın.
            </Text>
          </View>

          {earnedBadges.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <View style={styles.badgeTextArea}>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            </View>
          ))}

          {earnedBadges.length < 4 && (
            <View style={styles.lockedBadgeCard}>
              <Text style={styles.badgeIcon}>🔒</Text>
              <View style={styles.badgeTextArea}>
                <Text style={styles.badgeTitle}>Yeni rozetler seni bekliyor</Text>
                <Text style={styles.badgeDescription}>
                  Daha fazla görev tamamlayarak yeni rozetlerin kilidini açabilirsin.
                </Text>
              </View>
            </View>
          )}

          <SecondaryButton title="Ana sayfaya dön" onPress={goHome} />
        </ScrollView>
      </AppShell>
    );
  }

  if (screen === screens.LESSON && selectedLesson) {
    const card = selectedLesson.cards[cardIndex];
    const progress = Math.round(((cardIndex + 1) / totalCards) * 100);

    return (
      <AppShell>
        <SideMenu
          visible={menuOpen}
          user={currentUser}
          onClose={closeMenu}
          onHome={goHome}
          onProfile={goProfile}
          onBadges={goBadges}
          onLogout={logout}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title={selectedLesson.shortTitle} onBack={goHome} onMenu={openMenu} />

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
            <Text style={styles.missionAnswer}>
              Önerilen davranış: {selectedLesson.mission.correctAction}
            </Text>
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
        <SideMenu
          visible={menuOpen}
          user={currentUser}
          onClose={closeMenu}
          onHome={goHome}
          onProfile={goProfile}
          onBadges={goBadges}
          onLogout={logout}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title="Bilgi Kontrolü" onBack={goHome} onMenu={openMenu} />

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
                <Text style={optionTextStyle}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </Pressable>
            );
          })}

          {isAnswered && (
            <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
              <Text style={styles.feedbackTitle}>
                {isCorrect ? "Doğru cevap!" : "Tekrar düşünelim"}
              </Text>
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
        <SideMenu
          visible={menuOpen}
          user={currentUser}
          onClose={closeMenu}
          onHome={goHome}
          onProfile={goProfile}
          onBadges={goBadges}
          onLogout={logout}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopBar title="Sonuç" onBack={goHome} onMenu={openMenu} />

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
          <SecondaryButton title="Rozetlerimi gör" onPress={goBadges} />
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

function TopBar({ title, onBack, onMenu }) {
  return (
    <View style={styles.topBar}>
      {onBack ? (
        <Pressable style={styles.topIconButton} onPress={onBack}>
          <Text style={styles.topIconText}>‹</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.topIconButton} onPress={onMenu}>
          <Text style={styles.menuIconText}>☰</Text>
        </Pressable>
      )}

      <Text style={styles.topTitle}>{title}</Text>

      <View style={styles.topIconButtonPlaceholder} />
    </View>
  );
}

function SideMenu({ visible, user, onClose, onHome, onProfile, onBadges, onLogout }) {
  if (!visible) return null;

  return (
    <View style={styles.menuOverlay}>
      <Pressable style={styles.menuBackdrop} onPress={onClose} />
      <View style={styles.sideMenu}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuLogo}>LN</Text>
          <View>
            <Text style={styles.menuTitle}>LearNexus</Text>
            <Text style={styles.menuUser}>{user?.name || "Öğrenci"}</Text>
          </View>
        </View>

        <MenuItem icon="🏠" title="Ana Sayfa" onPress={onHome} />
        <MenuItem icon="👤" title="Profilim" onPress={onProfile} />
        <MenuItem icon="🏅" title="Rozetlerim" onPress={onBadges} />
        <MenuItem icon="🚪" title="Oyundan Çık" onPress={onLogout} />

        <Pressable style={styles.closeMenuButton} onPress={onClose}>
          <Text style={styles.closeMenuText}>Menüyü kapat</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MenuItem({ icon, title, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.menuItemIcon}>{icon}</Text>
      <Text style={styles.menuItemText}>{title}</Text>
    </Pressable>
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
  authScroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16
  },
  authCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4
  },
  authLogo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 4
  },
  authTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 18,
    marginBottom: 10
  },
  authLinkButton: {
    marginTop: 14,
    alignItems: "center"
  },
  authLinkText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563EB"
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 10
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 28
  },
 hero: {
  backgroundColor: "#FFFFFF",
  borderRadius: 22,
  paddingVertical: 14,
  paddingHorizontal: 16,
  marginBottom: 10,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowOffset: { width: 0, height: 5 },
  shadowRadius: 12,
  elevation: 3,
  alignItems: "center"
},
  logoImage: {
  width: 100,
  height: 85,
  resizeMode: "contain",
  marginBottom: 2,
  transform: [{ scale: 1.65 }]
},
  appTitle: {
  fontSize: 28,
  fontWeight: "900",
  color: "#0F172A",
  textAlign: "center",
  marginTop: 2
},
 appSubtitle: {
  marginTop: 6,
  fontSize: 13,
  lineHeight: 18,
  color: "#475569",
  textAlign: "center"
},
  quickActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  quickButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  quickIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  quickText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A"
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 10
  },
  progressText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 6
  },
  progressOuter: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 7
  },
  progressInner: {
    height: "100%",
    borderRadius: 99
  },
  smallText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2
  },
  lessonCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10
  },
  lessonTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  roundIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  roundIconText: {
    fontSize: 25
  },
  lessonTextArea: {
    flex: 1
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A"
  },
  courseText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3
  },
  checkText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A"
  },
  lessonObjective: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 19
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 6
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 7
  },
  infoText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  topIconButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  topIconButtonPlaceholder: {
    width: 38,
    height: 38
  },
  topIconText: {
    fontSize: 31,
    lineHeight: 32,
    color: "#0F172A"
  },
  menuIconText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A"
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A"
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row"
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)"
  },
  sideMenu: {
    width: 265,
    backgroundColor: "#FFFFFF",
    paddingTop: 42,
    paddingHorizontal: 16,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18
  },
  menuLogo: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 50,
    fontSize: 18,
    fontWeight: "900",
    marginRight: 10
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A"
  },
  menuUser: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 7,
    backgroundColor: "#F8FAFC"
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 10
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A"
  },
  closeMenuButton: {
    marginTop: 12,
    padding: 13,
    alignItems: "center"
  },
  closeMenuText: {
    color: "#2563EB",
    fontWeight: "900"
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12
  },
  avatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
    marginBottom: 10
  },
  avatarText: {
    fontSize: 42
  },
  profileName: {
    fontSize: 23,
    fontWeight: "900",
    color: "#0F172A"
  },
  profileUsername: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 3
  },
  profileStatsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16
  },
  profileStatBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  profileStatNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A"
  },
  profileStatLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
    textAlign: "center"
  },
  badgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 10
  },
  lockedBadgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10
  },
  badgeIcon: {
    fontSize: 34,
    marginRight: 12
  },
  badgeTextArea: {
    flex: 1
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A"
  },
  badgeDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
    marginTop: 3
  },
  topicHeader: {
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  bigEmoji: {
    fontSize: 50,
    marginBottom: 5
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center"
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 14,
    elevation: 2
  },
  cardHeading: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 9
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 23,
    color: "#334155"
  },
  analogyBox: {
    marginTop: 14,
    borderRadius: 16,
    padding: 13
  },
  analogyLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 5
  },
  analogyText: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 20
  },
  missionCard: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#9A3412",
    marginBottom: 7
  },
  missionText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#7C2D12",
    marginBottom: 7
  },
  missionAnswer: {
    fontSize: 13,
    lineHeight: 20,
    color: "#9A3412",
    fontWeight: "700"
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 9,
    elevation: 2
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1"
  },
  secondaryButtonText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900"
  },
  quizHeader: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  quizSmallTitle: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6
  },
  questionCounter: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 7
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  questionText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 26
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 9,
    borderWidth: 1.5,
    borderColor: "#CBD5E1"
  },
  optionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    lineHeight: 21
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
    borderRadius: 18,
    padding: 14,
    marginTop: 5,
    marginBottom: 8,
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
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4
  },
  feedbackText: {
    color: "#334155",
    lineHeight: 20
  },
  resultCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 12,
    marginBottom: 12
  },
  resultEmoji: {
    fontSize: 62,
    marginBottom: 8
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6
  },
  resultScore: {
    fontSize: 44,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4
  },
  resultText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 13
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  }
});
