import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  var className = "square";
  if (props.win) {
    className = "square-win";
  }
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // constructor(props) {
  // super(props);
  // this.state = {
  // squares: Array(9).fill(null),
  // xIsNext: true,
  // };
  // }

  // handleClick(i) {
  // const tempSquares = this.state.squares.slice();
  // if (calculateWinner(tempSquares) || tempSquares[i]) return;
  // tempSquares[i] = this.state.xIsNext ? "X" : "O";
  // this.setState({ squares: tempSquares, xIsNext: !this.state.xIsNext });
  // }

  renderSquare(i) {
    var result = false;
    if (this.props.win.includes(i)) {
      result = true;
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
        win={result}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      winners: Array(3).fill(-1),
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const tempSquares = current.squares.slice();
    if (tempSquares[i]) {
      return;
    }
    tempSquares[i] = this.state.xIsNext ? "X" : "O";
    if (calculateWinner(tempSquares) && this.state.winners.includes(-1)) {
      this.setState({
        winners: calculateWinner(tempSquares),
        history: history.concat([{ squares: tempSquares }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    } else if (this.state.winners.includes(-1)) {
      this.setState({
        history: history.concat([{ squares: tempSquares }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    } else {
      console.log("Winner already identified");
      return;
    }
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0,
      //winners: Array(3).fill(-1),
    });
  }

  render() {
    const history = this.state.history;
    //const current = history[history.length - 1];
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      const [a, b, c] = winner;
      status = "Winner is: " + current.squares[a];
      console.log(status, this.state.winners);
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    if (this.state.stepNumber === 9) {
      status = "It is a Draw!!";
    }

    //adding historical data
    const moves = history.map((step, move) => {
      const description = move ? " Show move # " + move : "Start playing game";
      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {description}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
            win={this.state.winners}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="history">
            <div>History of Moves</div>
            <ol>{moves}</ol>
          </div>
        </div>
        <div>
          <button
            className="game-restart"
            onClick={() => {
              window.location.reload();
            }}
          >
            RESTART
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
