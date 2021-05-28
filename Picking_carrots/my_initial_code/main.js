"use strict";

const gameScreen = document.querySelector(".game__screen");
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const displayCnt = document.querySelector(".carrot__count");
const replayBtn = document.querySelector(".replay__button");
const modal = document.querySelector(".modal");
const bgm = new Audio("../sound/bg.mp3");
const winEffect = new Audio("../sound/game_win.mp3");
let onPlay = false;
let carrotsCnt = 10;
let setTimer;

/*
 * Function : getRandomInt
 * Description : 유닛(당근이나 벌레)이 생성되는 위치를 구하는 함수
 * Parameter
 *  - max : 유닛을 생성할 위치 값의 최대 범위
 * Return Value : 0 ~ max 범위의 랜덤한 정수 값
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

/*
 * Function : getUnit
 * Description : 유닛(당근이나 벌레) 요소를 생성하는 함수
 * Parameter
 *  - maxX : 유닛을 생성할 x좌표의 최대 범위
 *  - maxY : 유닛을 생성할 y좌표의 최대 범위
 *  - type : 생성하는 유닛의 종류 (당근이나 벌레)
 *  - id : 생성한 유닛을 구별하는 식별자 (Default : 0)
 * Return Value : 생성한 유닛 요소
 */
function getUnit(maxX, maxY, type, id = 0) {
  const x = getRandomInt(maxX);
  const y = getRandomInt(maxY);
  const unit = document.createElement("div");
  unit.setAttribute("class", "unit");
  if (type === "carrot") {
    unit.innerHTML = `<img src="../img/carrot.png" alt="carrot" class="carrot" data-id="${id}">`;
  } else {
    unit.innerHTML = `<img src="../img/bug.png" alt="bug" class="bug">`;
  }
  unit.style.top = `${y}px`;
  unit.style.left = `${x}px`;

  return unit;
}

/*
 * Function : createUnits
 * Description : 게임 화면 필드 내 랜덤 위치에 당근과 벌레들을 생성하는 함수
 * Return Value : None
 */
function createUnits() {
  const unitZone = document.querySelector(".unit__zone");
  unitZone.innerHTML = "";
  const limitX = unitZone.clientWidth;
  const limitY = unitZone.clientHeight;
  const bugsCnt = 7;

  for (let i = 0; i < carrotsCnt; i++) {
    const unit = getUnit(limitX, limitY, "carrot", i);
    unitZone.appendChild(unit);
  }

  for (let i = 0; i < bugsCnt; i++) {
    const unit = getUnit(limitX, limitY, "bug");
    unitZone.appendChild(unit);
  }
}

/*
 * Function : init
 * Description : 게임 진행을 위한 화면 설정 및 자원 초기화 함수
 *  - modal popup 메시지 백그라운드로 전환
 *  - 당근 및 벌레 생성
 *  - 타이머 초기화
 *  - 배경음악 재생
 * Return Value : None
 */
const init = () => {
  winEffect.pause();
  winEffect.currentTime = 0;

  onPlay = true;
  modal.style.zIndex = -1;
  gameBtn.innerHTML = '<i class="fas fa-square"></i>';
  gameBtn.style.opacity = 1;

  carrotsCnt = 10;
  displayCnt.innerHTML = `${carrotsCnt}`;
  createUnits();

  let timeLimit = 10;
  gameTimer.innerHTML = `0:${timeLimit}`;
  setTimer = setInterval(() => countDown(--timeLimit), 1 * 1000);

  bgm.play();
};

/*
 * Function : popUpMsg
 * Description : 게임 종료(중단) 시 팝업 메시지 출력 함수
 * Parameter
 *  - gameResult : 게임 클리어 상태 값 (Default : false)
 *    1. true : game clear
 *    2. false : game lose (if onPlay == false, game stop)
 * Return Value : None
 */
const popUpMsg = (gameResult) => {
  clearInterval(setTimer);
  bgm.pause();
  bgm.currentTime = 0;
  gameBtn.style.opacity = 0;
  modal.style.zIndex = 1;
  let resultTxt;
  if (gameResult === true) {
    resultTxt = "YOU WON 🎉";
    winEffect.play();
  } else if (onPlay !== false) {
    resultTxt = "YOU LOST 💩";
  } else {
    resultTxt = "Replay ❓";
  }
  const result = document.querySelector(".result__text");
  result.innerHTML = `${resultTxt}`;
  onPlay = false;
};

/*
 * Function : countDown
 * Description : 게임 종료까지 남은 시간을 카운트하는 함수
 * Parameter
 *  - remainTime : 현재 남은 시간(sec)
 * Return Value : None
 */
const countDown = (remainTime) => {
  gameTimer.innerHTML = `0:${remainTime}`;
  if (remainTime === 0) {
    popUpMsg(false);
  }
};

gameBtn.addEventListener("click", () => {
  onPlay = onPlay ? false : true;
  if (onPlay === true) {
    init();
  } else {
    const stopAlert = new Audio("../sound/alert.wav");
    stopAlert.play();
    popUpMsg(false);
  }
});

replayBtn.addEventListener("click", () => {
  init();
});

gameScreen.addEventListener("click", (event) => {
  const target = event.target.className;
  if (target === "bug") {
    const pullBug = new Audio("../sound/bug_pull.mp3");
    pullBug.play();
    popUpMsg(false);
  } else if (target === "carrot") {
    const id = event.target.dataset.id;
    const carrot = document.querySelector(`.carrot[data-id="${id}"]`);
    carrot.remove();
    const pullCarrot = new Audio("../sound/carrot_pull.mp3");
    pullCarrot.play();

    displayCnt.innerHTML = `${--carrotsCnt}`;
    if (carrotsCnt === 0) {
      popUpMsg(true);
    }
  }
});
