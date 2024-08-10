/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

import { GameResultScreen } from "./game-result-screen.js";

/**
 * Represents the game screen of the application.
 */
export class GameScreen {
  /**
   * @param {ScreenManager} screenManager - The screen manager to control screen transitions.
   */
  constructor(screenManager) {
    /** @type {ScreenManager} */
    this.screenManager = screenManager;
    /** @type {GameResultScreen} */

    this.socresound = new Audio("/audio/score-sound.mp3");
    this.typesound = new Audio("/audio/typeSound.mp3");

    this.gameResultScreen = new GameResultScreen(screenManager);
    this.gameResultScreen.initialize();
    this.words = {
      normal: [
        {
          word: "東京特許許可局",
          key: "toukyoutokkyokyokakyoku",
        }, // ...
        {
          word: "ディジタルトランスフォーメーション",
          key: "delijitarutoransufo-me-shon",
        }, // ...
        {
          word: "キジムナー",
          key: "kijimuna-",
        }, // ...
      ],
      it: [
        {
          word: "ディレクトリトラバーサル",
          key: "delirekutoritoraba-saru",
        }, // ...
        {
          word: "クロスサイトリクエストフォージェリ",
          key: "kurosusaitorikuesutofo-jeri",
        }, // ...
        {
          word: "アイリス認証",
          key: "airisuninshou",
        }, // ...
      ],
    };
    /**
     * @type {string[]}
     */
    this.audioPaths = [];
    /** @type {HTMLAudioElement} */
    this.audio = new Audio();
    /**
     * it or normal
     */
    this.mode = "";
    /**
     * difficulty
     */
    this.difficulty = "";
    /**
     * @type {{ word: string; key: string; }[]}
     */
    this.questions = [];
    /**
     * @type {{ word: string; key: string; } | undefined}
     */
    this.currentQuestion = undefined;
    this.currentIndex = 0;
    this.currentTotal = 0;
    this.kanaView = document.getElementById("wordKana");
    this.romanView = document.getElementById("wordRoman");
    this.isGenerating = false;
    this.limitTime = 30000; // ms

    window.addEventListener("keydown", (e) => this.pushKeydown(e));
  }

  /**
   * Initializes the game screen.
   */
  async initialize() {
    if (this.isGenerating) return;
    this.questions = this.words[this.mode];
    console.log("生成中");
    await this.generateAudio();
    console.log("生成完了");
    this.audio.volume = this.screenManager.volume * 0.01;
    this.screenManager.showScreen("game");
    this.startGame();
  }

  startGame() {
    this.currentIndex = 0;
    this.currentTotal = 0;
    this.currentQuestion =
      this.questions[Math.floor(Math.random() * this.questions.length)];
    this.updateQuestion();
    this.updateScoreDisplay();
    this.startTimer();
  }

  pushKeydown(event) {
    if (this.screenManager.currentScreen !== "game") {
      console.log("ゲーム以外の画面");
      return;
    }

    const keyCode = event.key;

    if (Array.from(this.currentQuestion.key)[this.currentIndex] === keyCode) {
      console.log("正解");
      document.querySelectorAll("#wordRoman span").forEach((ele, index) => {
        if (index <= this.currentIndex) {
          ele.classList.add("red");
        }
      });

      this.typesound.currentTime = 0;
      this.typesound
        .play()
        .catch((error) =>
          console.error("タイプ音の再生に失敗しました:", error),
        );

      if (this.currentIndex < this.currentQuestion.key.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
        this.currentTotal++;
        this.updateScoreDisplay();
        this.currentQuestion =
          this.questions[Math.floor(Math.random() * this.questions.length)];
        this.updateQuestion();
      }
    } else {
      // タイプミス音の追加（例えば、ミスした場合に音を鳴らす）
      this.typesound.currentTime = 0;
      this.typesound
        .play()
        .catch((error) => console.error("ミス音の再生に失敗しました:", error));
    }
  }

  updateQuestion() {
    this.kanaView.innerHTML = this.currentQuestion.word;
    const spanFragment = document.createDocumentFragment();
    Array.from(this.currentQuestion.key).forEach((key) => {
      const spanElement = document.createElement("span");
      spanElement.innerHTML = key;
      spanFragment.appendChild(spanElement);
    });
    this.romanView.innerHTML = "";
    this.romanView.appendChild(spanFragment);
    this.playAudio();
  }

  startTimer() {
    const startTime = Date.now();

    const timerId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= this.limitTime) {
        clearInterval(timerId);
        this.timeUp();
      } else {
        this.updateTimerDisplay(this.limitTime - elapsedTime);
      }
    }, 20);
  }

  timeUp() {
    this.audio.pause();
    this.resultSound();
    this.showResults();
  }

  updateTimerDisplay(remainingTime) {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = (remainingTime / 1000).toFixed(2);
  }

  updateScoreDisplay() {
    const socreElement = document.getElementById("point");
    socreElement.innerHTML = this.currentTotal;
  }

  showResults() {
    this.screenManager.showScreen("game-result");
  }

  resultSound() {
    this.screenManager.showScreen("game-result"); // 修正済み
    this.socresound.currentTime = 0; // 効果音をリセット
    this.socresound.play(); // 効果音を再生
  }

  async generateAudio() {
    this.isGenerating = true;
    const paths = await Promise.all(
      this.questions.map(async (question) => {
        const response = await fetch(`/voicevox?text=${question.word}`, {
          cache: "force-cache",
        });
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
      }),
    );
    console.log(paths);
    this.audioPaths = paths;
    this.isGenerating = false;
  }

  playAudio() {
    const currentQuestionIndex = this.questions.findIndex(
      (question) => question.key === this.currentQuestion.key,
    );
    this.audio.src = this.audioPaths[currentQuestionIndex];
    this.audio.play();
  }
}
