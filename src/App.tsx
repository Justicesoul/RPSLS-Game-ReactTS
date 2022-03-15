import { useEffect, useState } from 'react';
import Form from './components/Form';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSound from 'use-sound';
import AfterGame from './components/AfterGame';

const gameMode = [
  { winnerByFrames: 1, bestOf: 'Best of 1 frame' },
  { winnerByFrames: 2, bestOf: 'Best of 3 frames' },
  { winnerByFrames: 3, bestOf: 'Best of 5 frames' },
  { winnerByFrames: 4, bestOf: 'Best of 7 frames' },
  { winnerByFrames: 5, bestOf: 'Best of 9 frames' },
];

const gameEvents = [
  { name: 'lizard', imgSrc: './lizard.png' },
  { name: 'paper', imgSrc: './paper.png' },
  { name: 'rock', imgSrc: './rock.png' },
  { name: 'scissors', imgSrc: './scissors.png' },
  { name: 'spock', imgSrc: './spock.png' },
];

const App = () => {
  const [inputName, setInputName] = useState('');
  const [selectGameMode, setSelectGameMode] = useState('');
  const [closeModal, setCloseModal] = useState(false);
  const [robotImg, setRobotImg] = useState('robot.jfif');
  const [userSelectEvent, setUserSelectEvent] = useState('');
  const [botSelectEvent, setBotSelectEvent] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [soundVolume, setSoundVolume] = useState(1);
  const [soundVolumeFireplace, setSoundVolumeFireplace] = useState(1);

  const [gameHistory, setGameHistory] = useState<(number | string)[][]>(() => {
    const saved = localStorage.getItem('history') || '';
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  const [playClick] = useSound('/click2.wav');
  const [playWin, { stop }] = useSound(
    'https://www.pacdv.com/sounds/applause-sound/app-9.mp3'
  );
  const [playLose] = useSound('/lose.mp3', { volume: soundVolume });
  const [playFireplace] = useSound('fireplace.mp3', {
    volume: soundVolumeFireplace,
  });

  const currentdate = new Date();
  const datetime =
    currentdate.getDate() +
    '.' +
    (currentdate.getMonth() + 1) +
    '.' +
    currentdate.getFullYear() +
    ', Time: ' +
    currentdate.getHours() +
    ':' +
    (currentdate.getMinutes() < 10
      ? '0' + currentdate.getMinutes()
      : currentdate.getMinutes()) +
    ':' +
    (currentdate.getSeconds() < 10
      ? '0' + currentdate.getSeconds()
      : currentdate.getSeconds());

  const notifyWin = () => toast.success('You won a frame! 😎👍');
  const notifyLoss = () => toast.error('You lose a frame! 👎😨');
  const notifyDraw = () => toast("It's a draw! 🤖");

  const gameModeState = parseInt(selectGameMode, 10);

  const clickHandler = (value: string) => {
    setUserSelectEvent(value);
    botEventGenerator();
    setGameStart(true);
    playClick();
  };

  const botEventGenerator = () => {
    const randomSelection =
      gameEvents[Math.floor(Math.random() * gameEvents.length)];
    setBotSelectEvent(randomSelection.name);
    setRobotImg(randomSelection.imgSrc);
  };

  const afterGame = () => {
    setCloseModal(false);
    setGameHistory([...gameHistory, [userScore, botScore, datetime]]);
    localStorage.setItem('history', JSON.stringify(gameHistory));
  };

  useEffect(() => {
    const frame = userSelectEvent + botSelectEvent;
    if (
      frame === 'scissorspaper' ||
      frame === 'rockscissors' ||
      frame === 'paperrock' ||
      frame === 'paperlizard' ||
      frame === 'scissorsspock' ||
      frame === 'lizardrock' ||
      frame === 'spockpaper' ||
      frame === 'rockspock' ||
      frame === 'lizardscissors' ||
      frame === 'spocklizard'
    ) {
      setUserScore(userScore + 1);
      notifyWin();
    } else if (
      frame === 'paperscissors' ||
      frame === 'scissorsrock' ||
      frame === 'rockpaper' ||
      frame === 'lizardpaper' ||
      frame === 'spockscissors' ||
      frame === 'rocklizard' ||
      frame === 'paperspock' ||
      frame === 'spockrock' ||
      frame === 'scissorslizard' ||
      frame === 'lizardspock'
    ) {
      setBotScore(botScore + 1);
      notifyLoss();
    } else if (
      frame === 'rockrock' ||
      frame === 'paperpaper' ||
      frame === 'scissorsscissors' ||
      frame === 'lizardlizard' ||
      frame === 'spockspock'
    ) {
      notifyDraw();
    }
    setBotSelectEvent('');
    setUserSelectEvent('');
  }, [botSelectEvent, userSelectEvent]);

  useEffect(() => {
    if (gameModeState === userScore) {
      afterGame();
      playWin();
    }
    if (gameModeState === botScore) {
      afterGame();
      playLose();
      setSoundVolume(1);
    }
  }, [userScore, botScore]);

  useEffect(() => {
    if (closeModal) {
      stop();
      setSoundVolume(0);
    }
  }, [closeModal]);

  return (
    <>
      {!closeModal && !gameStart && (
        <div className="container">
          <Form
            inputName={inputName}
            setInputName={setInputName}
            selectGameMode={selectGameMode}
            setSelectGameMode={setSelectGameMode}
            gameMode={gameMode}
            setCloseModal={setCloseModal}
          />
        </div>
      )}
      {!closeModal && gameStart && (
        <div className="container">
          <AfterGame
            setCloseModal={setCloseModal}
            userScore={userScore}
            playFireplace={playFireplace}
            botScore={botScore}
            setUserScore={setUserScore}
            setBotScore={setBotScore}
            setRobotImg={setRobotImg}
            stopSound={stop}
            setSoundVolume={setSoundVolume}
            setSoundVolumeFireplace={setSoundVolumeFireplace}
            setGameHistory={setGameHistory}
          />
        </div>
      )}
      {closeModal && (
        <>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            transition={Zoom}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <img className="background" src="game.gif" alt="game" />

          <div className="App">
            <header>
              <img
                className="header__logo"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pierre_ciseaux_feuille_l%C3%A9zard_spock_aligned.svg/768px-Pierre_ciseaux_feuille_l%C3%A9zard_spock_aligned.svg.png"
                alt="logo"
              />
              <h1>Rock, paper, scissors, lizard and spock</h1>
            </header>
            <h2>{`Best of ${gameModeState * 2 - 1} ${
              selectGameMode === '1' ? 'frame' : 'frames'
            }`}</h2>
            <h3>{`(to ${selectGameMode} ${
              selectGameMode === '1' ? 'win' : 'wins'
            })`}</h3>
            <main>
              <div className="player">
                <h3 className="player__name">{inputName}</h3>
                {gameEvents.map(({ name, imgSrc }) => {
                  return (
                    <img
                      className={`game-event ${name}`}
                      src={imgSrc}
                      alt={name}
                      title={name}
                      key={name}
                      onClick={() => clickHandler(name)}
                    />
                  );
                })}
                <img
                  className="player-options__img"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pierre_ciseaux_feuille_l%C3%A9zard_spock_aligned.svg/768px-Pierre_ciseaux_feuille_l%C3%A9zard_spock_aligned.svg.png"
                  alt="player"
                />
              </div>
              <span className="vs">
                {selectGameMode === '1' ? 'VS' : `${userScore} : ${botScore}`}
              </span>
              <div className="player">
                <h3 className="player__name">Gamebot 1.0</h3>
                <img
                  className="player-options__img robot"
                  src={robotImg}
                  alt="robot"
                />
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default App;
