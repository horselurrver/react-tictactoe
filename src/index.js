import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Restart(props) {
  return (
    <button className="restart" onClick={props.restart}>
      Restart
    </button>
  )
}

function ToggleButton(props) {
  return (
    <button className="toggle-button" onClick={props.toggleOrder}>
      {props.isAscending ? 'Ascending' : 'Descending'}
    </button>
  );
}

function Square(props) {
  let winnerSquares = props.winnerSquares;
  if (winnerSquares.includes(props.index)) {
    return (
      <button className="win-square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderToggleButton() {
    return (
      <ToggleButton
      isAscending={this.props.isAscending}
      toggleOrder={this.props.toggleOrder}
      />
    );
  }

  renderRestartButton() {
    return (
      <Restart
       restart={this.props.restart}/>
    );
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        index={i}
        winnerSquares={this.props.winnerSquares}
      />
    );
  }

  render() {
    const row1 = [];
    const row2 = [];
    const row3 = [];

    for (let i = 0; i < 9; i++) {
      if (i < 3) {
        row1.push(this.renderSquare(i));
      } else if (i < 6) {
        row2.push(this.renderSquare(i));
      } else {
        row3.push(this.renderSquare(i));
      }
    }

    return (
      <div>
        {this.renderToggleButton()}
        <div className="board">
          {[row1, row2, row3].map((row, index) => {
            return (
              <div key={index} className="board-row">
                {row}
              </div>
            )
          })}
        </div>
        {this.renderRestartButton()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    };
    this.toggleOrder = this.toggleOrder.bind(this);
    this.restart = this.restart.bind(this);
  }

  toggleOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  restart() {
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    });
    console.log('RESTART');
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let winner = calculateWinner(current.squares);
    let winnerSquares = []
    if (winner) {
      winnerSquares = winner[1];
      winner = winner[0];
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' at square ' + step.move:
        'Go to game start';
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.history.length === 10) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if (!this.state.isAscending) {
      moves.reverse();
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            isAscending={this.state.isAscending}
            toggleOrder={this.toggleOrder}
            winnerSquares={winnerSquares}
            restart={this.restart}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}
