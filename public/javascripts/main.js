"use strict";

import { GameScreen } from "./modules/screens/game-screen.js";
import { ScreenManager } from "./modules/screen-manager.js";
import { SelectModeScreen } from "./modules/screens/select-mode-screen.js";
import { SettingScreen } from "./modules/screens/setting-screen.js";
import { TitleScreen } from "./modules/screens/title-screen.js";

document.addEventListener("DOMContentLoaded", () => {
  const screenManager = new ScreenManager();
  screenManager.initialize();

  const titleScreen = new TitleScreen(screenManager);
  titleScreen.initialize();

  const settingScreen = new SettingScreen(screenManager);
  settingScreen.initialize();

  const selectModeScreen = new SelectModeScreen(screenManager);
  selectModeScreen.initialize();

  const gameScreen = new GameScreen(screenManager);
  gameScreen.initialize();
});
