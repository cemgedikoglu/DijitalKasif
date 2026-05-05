export const lessons = [
  {
    id: "security",
    shortTitle: "Ağ Güvenliği",
    title: "Bilgisayar Ağları: Siber Güvenlik",
    course: "Computer Networks - Cybersecurity",
    icon: "🛡️",
    color: "#4F46E5",
    softColor: "#EEF2FF",
    storyTitle: "Okul ağına güvenli giriş",
    level: "Ortaokul",
    objective:
      "Öğrencilerin güçlü şifre, güvenli bağlantı, kimlik avı ve veri güvenliği kavramlarını öğrenmesi.",
    cards: [
      {
        heading: "Siber güvenlik nedir?",
        body:
          "Siber güvenlik; bilgisayarları, telefonları, ağları ve kişisel bilgileri kötü niyetli kişilerden korumaktır.",
        analogy:
          "Okul çantanı korumak için fermuarını kapatman gibi, dijital bilgilerini de güvenlik önlemleriyle korursun."
      },
      {
        heading: "Güçlü şifre nasıl olur?",
        body:
          "Güçlü şifre; uzun, tahmin edilmesi zor ve harf, sayı, sembol içeren şifredir. Doğum tarihi veya okul numarası gibi kolay bilgiler kullanılmamalıdır.",
        analogy:
          "Güçlü şifre, herkesin deneyerek açamayacağı sağlam bir kilit gibidir."
      },
      {
        heading: "Kimlik avı nedir?",
        body:
          "Kimlik avı, sahte mesaj veya bağlantılarla kişisel bilgilerini ele geçirmeye çalışmaktır. Bilmediğin linklere tıklamadan önce kaynağını kontrol etmelisin.",
        analogy:
          "Sahte bir görevlinin okul kapısında senden kimliğini istemesi gibi düşünebilirsin."
      },
      {
        heading: "Güvenli ağ kullanımı",
        body:
          "Ortak Wi-Fi ağlarında şifre, banka bilgisi veya özel dosya paylaşmak riskli olabilir. Güvenilir ağları tercih etmek daha güvenlidir.",
        analogy:
          "Kalabalık bir yerde yüksek sesle sırlarını söylememek gibi, ortak ağlarda da özel bilgilerini paylaşmamalısın."
      }
    ],
    mission: {
      title: "Mini görev",
      text:
        "Bir arkadaşın sana 'bedava oyun hediyesi' yazan bir link gönderdi. Link senden kullanıcı adı ve şifre istiyor. Ne yaparsın?",
      correctAction:
        "Linke tıklamadan önce kaynağı kontrol eder, güvenilir değilse bilgilerini girmezsin."
    },
    quiz: [
      {
        question: "Siber güvenliğin temel amacı nedir?",
        options: [
          "Bilgileri ve cihazları korumak",
          "Bilgisayarı daha ağır çalıştırmak",
          "Tüm sitelere şifresiz girmek",
          "İnterneti tamamen kapatmak"
        ],
        answerIndex: 0,
        feedback:
          "Doğru. Siber güvenlik; cihazları, ağları ve bilgileri korumayı amaçlar."
      },
      {
        question: "Aşağıdakilerden hangisi daha güçlü bir şifredir?",
        options: ["123456", "adımsoyadım", "Okul2026!Mavi", "dogumtarihim"],
        answerIndex: 2,
        feedback:
          "Doğru. Uzun, karışık ve tahmin edilmesi zor şifreler daha güvenlidir."
      },
      {
        question: "Kimlik avı saldırısında genellikle ne yapılır?",
        options: [
          "Kullanıcıdan sahte linkle bilgi istenir",
          "Bilgisayarın ekran parlaklığı artırılır",
          "Dosyalar alfabetik sıralanır",
          "Wi-Fi adı değiştirilir"
        ],
        answerIndex: 0,
        feedback:
          "Doğru. Kimlik avında sahte bağlantılarla bilgi çalınmaya çalışılır."
      },
      {
        question: "Ortak Wi-Fi kullanırken hangisi daha güvenli davranıştır?",
        options: [
          "Her bağlantıya güvenmek",
          "Özel bilgileri paylaşmamak",
          "Şifreyi herkesle paylaşmak",
          "Gelen tüm dosyaları açmak"
        ],
        answerIndex: 1,
        feedback:
          "Doğru. Ortak ağlarda özel bilgi paylaşmamak daha güvenlidir."
      }
    ]
  },
  {
    id: "filesystem",
    shortTitle: "Dosya Sistemi",
    title: "İşletim Sistemleri: Dosya Sistemi",
    course: "Operating Systems - File-System Interface",
    icon: "📁",
    color: "#0EA5E9",
    softColor: "#E0F2FE",
    storyTitle: "Dijital dolabını düzenle",
    level: "Ortaokul",
    objective:
      "Öğrencilerin dosya, klasör, dosya uzantısı, dosya yolu ve işletim sisteminin düzenleme görevini kavraması.",
    cards: [
      {
        heading: "Dosya sistemi nedir?",
        body:
          "Dosya sistemi, işletim sisteminin dosyaları kaydetmek, bulmak, düzenlemek ve silmek için kullandığı yapıdır.",
        analogy:
          "Bir kütüphanede kitapların raflara göre düzenlenmesi gibi, bilgisayarda dosyalar da belli bir düzene göre saklanır."
      },
      {
        heading: "Dosya ve klasör farkı",
        body:
          "Dosya; resim, metin, video veya uygulama gibi içeriklerdir. Klasör ise dosyaları bir arada tutan dijital kutudur.",
        analogy:
          "Defter bir dosya, defterleri koyduğun çanta ise klasör gibi düşünülebilir."
      },
      {
        heading: "Dosya uzantısı ne işe yarar?",
        body:
          "Dosya uzantısı, dosyanın türünü gösterir. Örneğin .jpg resim, .pdf belge, .mp4 video dosyası olabilir.",
        analogy:
          "Bir kitabın kapağındaki tür bilgisi gibi, dosya uzantısı da dosyanın ne olduğunu anlamaya yardım eder."
      },
      {
        heading: "Dosya yolu nedir?",
        body:
          "Dosya yolu, bir dosyanın bilgisayarda nerede bulunduğunu gösteren adrestir. Örneğin Belgeler/Proje/rapor.pdf gibi.",
        analogy:
          "Ev adresin nasıl seni bulmayı sağlıyorsa, dosya yolu da bilgisayarın dosyayı bulmasını sağlar."
      }
    ],
    mission: {
      title: "Mini görev",
      text:
        "Bilgisayarında matematik ödevi, fotoğraflar ve müzikler karışık halde duruyor. Daha düzenli olması için ne yaparsın?",
      correctAction:
        "Her dosya türü veya ders için ayrı klasörler oluşturup dosyaları uygun klasörlere taşırsın."
    },
    quiz: [
      {
        question: "Dosya sisteminin görevi aşağıdakilerden hangisidir?",
        options: [
          "Dosyaları düzenli biçimde saklamak ve bulmak",
          "Ekranı sürekli kapatmak",
          "İnterneti hızlandırmak",
          "Klavyenin rengini değiştirmek"
        ],
        answerIndex: 0,
        feedback:
          "Doğru. Dosya sistemi dosyaların saklanmasını, bulunmasını ve düzenlenmesini sağlar."
      },
      {
        question: "Klasör ne işe yarar?",
        options: [
          "Dosyaları gruplamaya yarar",
          "Sadece oyun açar",
          "Bilgisayarı şarj eder",
          "İnternet şifresini değiştirir"
        ],
        answerIndex: 0,
        feedback:
          "Doğru. Klasörler dosyaları düzenli tutmak için kullanılır."
      },
      {
        question: ".jpg uzantısı genellikle hangi dosya türünü gösterir?",
        options: ["Resim", "Ses", "Programlama kodu", "Sıkıştırılmış dosya"],
        answerIndex: 0,
        feedback:
          "Doğru. .jpg en yaygın resim dosyası uzantılarından biridir."
      },
      {
        question: "'Belgeler/Proje/rapor.pdf' ifadesi neye örnektir?",
        options: ["Dosya yolu", "Ekran kartı", "Wi-Fi ağı", "Şifreleme yöntemi"],
        answerIndex: 0,
        feedback:
          "Doğru. Bu ifade dosyanın bilgisayardaki konumunu gösteren bir dosya yoludur."
      }
    ]
  }
];
