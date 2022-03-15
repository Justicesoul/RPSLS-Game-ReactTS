import { useEffect, useState } from 'react';
import History from './History';

type AfterGameProps = {
  botScore: number;
  userScore: number;
  setCloseModal: (arr: boolean) => void;
  setUserScore: (arr: number) => void;
  setBotScore: (arr: number) => void;
  setRobotImg: (arr: string) => void;
  setSoundVolume: (arr: number) => void;
  stopSound: () => void;
  playFireplace: () => void;
  setSoundVolumeFireplace: (arr: number) => void;
  setGameHistory: (arr: []) => void;
};

const AfterGame: React.FC<AfterGameProps> = ({
  userScore,
  botScore,
  setCloseModal,
  setUserScore,
  setBotScore,
  setRobotImg,
  setSoundVolume,
  setSoundVolumeFireplace,
  stopSound,
  playFireplace,
  setGameHistory,
}) => {
  const [resultWon, setResultWon] = useState<null | boolean>(null);
  const [openHistory, setOpenHistory] = useState(false);

  const clickHandlerPlayAgain = () => {
    setCloseModal(true);
    setSoundVolumeFireplace(0);
    setUserScore(0);
    setBotScore(0);
    setRobotImg('robot.jfif');
  };

  const clickHandlerBackToSetup = () => {
    document.location.reload();
  };

  const clickHandlerHistory = () => {
    setOpenHistory(true);
    setSoundVolume(0);
    setSoundVolumeFireplace(1);
    stopSound();
    playFireplace();
  };

  useEffect(() => {
    userScore > botScore ? setResultWon(true) : setResultWon(false);
  }, [userScore, botScore]);

  return (
    <>
      {!openHistory && (
        <div className="after-game">
          <div className="after-game__heading">
            <h1>{resultWon ? 'You Won!!! :)' : 'You Lose!!! :('}</h1>
          </div>
          <img
            className="after-game__img"
            src={resultWon ? 'congratulations.gif' : 'disappointed.gif'}
            alt=""
          />
          <div className="after-game__heading buttons__row">
            <button className="form__button" onClick={clickHandlerPlayAgain}>
              Play Again
            </button>
            <button className="form__button" onClick={clickHandlerBackToSetup}>
              Back to setup
            </button>
            <button className="form__button" onClick={clickHandlerHistory}>
              Show my history
            </button>
          </div>
        </div>
      )}
      {openHistory && (
        <History
          playAgain={clickHandlerPlayAgain}
          backToSetup={clickHandlerBackToSetup}
          setGameHistory={setGameHistory}
        />
      )}
    </>
  );
};

export default AfterGame;
