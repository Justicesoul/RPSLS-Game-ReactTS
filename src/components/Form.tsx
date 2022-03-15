import { useEffect, useState } from 'react';
import useSound from 'use-sound';

type FormProps = {
  inputName: string;
  setInputName: (arr: string) => void;
  selectGameMode: string;
  setSelectGameMode: (arr: string) => void;
  gameMode: {
    winnerByFrames: number;
    bestOf: string;
  }[];
  setCloseModal: (arr: boolean) => void;
};

const Form: React.FC<FormProps> = ({
  inputName,
  setInputName,
  selectGameMode,
  setSelectGameMode,
  gameMode,
  setCloseModal,
}) => {
  const [countdownToStart, setCountdownToStart] = useState(false);
  const [playCountdown] = useSound('countdown.wav');

  const submit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCountdownToStart(true);

    if (inputName.replaceAll(/\s/g, '').length === 0) {
      setInputName('Am i a robot?');
    }
    if (selectGameMode === '' || selectGameMode === '0') {
      const randomSelection = Math.floor(Math.random() * gameMode.length + 1);
      setSelectGameMode(randomSelection.toString());
    }
    const interval = setTimeout(() => {
      playCountdown();
    }, 500);
    return () => clearTimeout(interval);
  };

  useEffect(() => {
    if (countdownToStart) {
      const interval = setInterval(() => {
        setCloseModal(true);
      }, 4180);
      return () => clearInterval(interval);
    }
  }, [countdownToStart]);

  return (
    <>
      {!countdownToStart && (
        <form className="form" onSubmit={submit}>
          <h2>Select game mode</h2>
          <label>
            Enter your name
            <input
              className="form__label"
              type="text"
              placeholder="Name"
              value={inputName}
              maxLength={18}
              onChange={(e) => {
                setInputName(e.target.value);
              }}
            />
          </label>
          <label>
            Choose game mode
            <select
              value={selectGameMode}
              onChange={(e) => {
                setSelectGameMode(e.target.value);
                console.log(e.target.value);
              }}
              className="form__label margin-bottom"
            >
              <option value="0">- Random -</option>
              {gameMode.map(({ bestOf, winnerByFrames }) => {
                return (
                  <option key={bestOf} value={winnerByFrames}>
                    {bestOf}
                  </option>
                );
              })}
            </select>
          </label>
          <button className="form__button no-margin">Let's go!</button>
        </form>
      )}
      {countdownToStart && (
        <img
          className="count-down"
          src="https://c.tenor.com/7HFPLm7Rl8oAAAAC/321-count-down.gif"
          alt="count-down"
        />
      )}
    </>
  );
};

export default Form;
