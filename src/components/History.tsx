type HistoryProps = {
  backToSetup: () => void;
  playAgain: () => void;
  setGameHistory: (arr: []) => void;
};

const History: React.FC<HistoryProps> = ({
  playAgain,
  backToSetup,
  setGameHistory,
}) => {
  const history = JSON.parse(
    localStorage.getItem('history') || JSON.stringify([])
  );

  const clearHistory = () => {
    setGameHistory([]);
    localStorage.setItem('history', JSON.stringify([]));
  };

  return (
    <div className="history">
      <div className="history__fireplace">
        <img
          className="history__fireplace--img"
          src="fireplace.gif"
          alt="fireplace"
        />
      </div>
      <div className="buttons__row absolute">
        <button className="form__button" onClick={playAgain}>
          Play Again
        </button>
        <button className="form__button" onClick={backToSetup}>
          Back to setup
        </button>
        <button className="form__button" onClick={clearHistory}>
          Clear history
        </button>
      </div>
      <div className="history__history">
        <div className="history__container">
          <img className="history__frame" src="frame.png" alt="" />
          <div className="history__data">
            <h4 className="history__heading">Games history:</h4>
            {history.map((game: number[]) => {
              return (
                <h5>
                  {`Date: ${game[2]}`}
                  {game[0] > game[1]
                    ? `, Won ${game[0]}:${game[1]}`
                    : `, Lose ${game[0]}:${game[1]}`}
                </h5>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
