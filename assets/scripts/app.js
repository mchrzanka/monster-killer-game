const ATTACK_VALUE = 10; //a good way to name global variables that we hardcode in. Not required but a convention you see in some programs.
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

//let the player choose the max life amount
const enteredValue = prompt('Maximum life for you and the monster.', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

function writeToLog(e, value, monsterHealth, playerHealth){
    //make a log entry object that holds values you want to show in the log.
    let logEntry={
            event: e,
            value: value,
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
    };

    //you then check what kind of event happened, and add to the log who the target was of the event. Target doesn't already exist in the object we made above, so this will create it. 
    if (e === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = "MONSTER";
    
    } else if(e === LOG_EVENT_PLAYER_STRONG_ATTACK){
            logEntry.target = "MONSTER";

    } else if(e === LOG_EVENT_MONSTER_ATTACK){
        logEntry.target = "PLAYER";

    }else if(e === LOG_EVENT_PLAYER_HEAL){
        logEntry.target = "PLAYER";

    }

    battleLog.push(logEntry);
}

adjustHealthBars(chosenMaxLife);

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;

  //monster attack on us
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);


  //check if we have a bonus life
  if (currentPlayerHealth <= 0 && hasBonusLife){
    //use the bonus life
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the bonus life saved you!");

  }

  //check our health and the monsters health to see if any have hit zero, to end the game. If not, none of this code is executed and we continue with the game.
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You Lost!");
    writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("You have a draw!");
    writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
    reset();
  }
}

function attackMonster(attackMode) {
  let maxDamage;
  let logEvent;
  if (attackMode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  //our attack on the monster
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;

  writeToLog(logEvent,monsterDamage, currentMonsterHealth, currentPlayerHealth);

  console.log("Playerdealt damage:" + monsterDamage);

  endRound();
}

//on attack event listener
function attackHandler() {
  attackMonster("ATTACK");
}

//strong monster attack
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

//healing yourself
function healPlayerHandler() {

    let healValue;

    //we check to see if the player health is greater than 80 to use the 20 heal points. If it is, we use our new healValue (which calculates the max health - current player health) and adds that amount. If it's not, we use the full 20 points of healing.
    if(currentPlayerHealth >= (chosenMaxLife - HEAL_VALUE)){
        alert ("You can't heal to more than your max initial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
          increasePlayerHealth(healValue);

  //update our health amount. If I don't include this, the css is updated for the health bar, but the actual amount isn't and we end up dying even though it shows a full health bar. 
  currentPlayerHealth += healValue;

  writeToLog(LOG_EVENT_PLAYER_HEAL,healValue, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function printLogHandler(){
    console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
