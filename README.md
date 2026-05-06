# LearNexus

## Team Information

**Group No:** 2

**Team Members**

- Cem GEDİKOĞLU
- Çağrı KAÇMAZ
- İlknur AKSARAY
- Yusuf KUTLU

## About the Project

Dijital Kaşif is a mobile learning application designed for middle school students. The app aims to introduce basic computer science concepts in a simple and understandable way.

The project combines topics from two courses: Operating Systems and Computer Networks. The selected topics were adapted for younger learners by using short explanations, daily life examples, mini tasks, and quiz questions.

## Selected Topics

| Course | Topic |
|---|---|
| Computer Networks | Cybersecurity |
| Operating Systems | File-System Interface |

In the cybersecurity module, students learn about safe internet use, strong passwords, suspicious links, and protecting personal information.

In the file-system module, students learn how files and folders are used to organize digital information.

## Learning Flow

The application follows a simple learning structure:

1. The student selects a topic.
2. The app presents a short explanation.
3. A real-life example supports the topic.
4. A mini task helps the student think about the concept.
5. Quiz questions are shown.
6. The student receives instant feedback.
7. The final screen shows the score and progress.

This structure was chosen to help students understand the topic before answering questions.

## Main Features

- Two learning modules
- Short and clear topic explanations
- Real-life examples
- Mini task scenarios
- Multiple-choice quiz questions
- Instant feedback for answers
- Score and progress screen
- Simple mobile-friendly interface

## Technologies Used

- React Native
- Expo
- JavaScript
- GitHub

The project was developed as a mobile application with React Native and Expo. For this reason, the interface and styling were created with React Native components and JavaScript instead of separate HTML and CSS files.

## Project Structure

```text
Team2_OS_ComNets/
├── App.js
├── app.json
├── package.json
├── README.md
├── .gitignore
└── data/
    └── lessons.js
```

## How to Run

First, install the required packages:

```bash
npm install
```

Then start the project:

```bash
npm start
```

To run the project on web:

```bash
npx expo start --web
```

## Future Goals

In future versions, the application can be improved by adding more topics from both courses. Simple animations can also be used to explain abstract concepts more clearly.

Other possible improvements include user progress storage, badges, difficulty levels, more interactive mini tasks, dark mode, and accessibility options for different learners.

## Conclusion

Dijital Kaşif presents selected computer science topics in a simple mobile learning environment. The current version includes the main learning flow, lesson content, quiz structure, feedback system, and score screen. The project can be expanded with more interactive features in future versions.
