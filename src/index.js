import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Quadrados do tabuleiro
function Square(props) {
    // Variavel referente ao estilo do quadrado
    var styles = null;

    // Validando se existi um vencedor para destacar os quadrados
    if (props.winningSquares) {
        styles = props.winningSquares.filter((res) => res === props.colorValue);

        if (styles[0] + 1) {
            styles = { color: 'red' };
        } else {
            styles = null;
        }
    }

    return (
        <button className='square' onClick={props.onClick} style={styles}>
            {props.value}
        </button>
    );
}

// Tabuleiro
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i} // Indentificador chave
                value={this.props.squares[i]} // Variavel referente ao valor se é "X" ou "O"
                onClick={() => this.props.onClick(i)} // Propries para que possa atribuir o valor
                winningSquares={this.props.finishSquares} // Array com o elementos do vencedor (posições e valor)
                colorValue={i} // Valor index de cada quadrado
            />
        );
    }

    render() {
        // Formando o tabuleiro completo
        const line = Array(3).fill(null);
        const element = Array(3).fill(null);

        var row = '';
        var index = 0;
        var result = line.map((res, i) => {
            row = '';
            row = element.map((res, j) => {
                // Chamando e retornando o quadrado
                return this.renderSquare(index++);
            });

            // Retornando por linha
            return (
                <div key={i} className='board-row'>
                    {row}
                </div>
            );
        });
        // Retornando o tabuleiro interiro
        return <div>{result}</div>;
    }
}

// Jogo completo
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null), // Varialvel referent as jogadas (posições dos "X" e "O")
                    stepName: '', // Variavel referente as posição da jogada (coluna e linha) da jogada respectivamente
                },
            ],
            stepNumber: 0, // Variavel referente ao index da jogada
            xIsNext: true, // Variavel referente ao proximo jogador a jogar
            checked: false, // Variavel referente a ordem das jogadas (Ascendente e descendente)
        };
    }

    // Evento referente a jogada recebida
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); // Variavel com todas as jogadas relativas ao StepNumber (Jogada Selecionada)
        const current = history[history.length - 1]; // Ultima jogada antes da recebida
        const squares = current.squares.slice(); // Array com os quadrados marcados com as jogadas
        var stepName = current.stepName; // Variavel de referencia StepName

        // Verificando se a jogada recebida ja existe "squares[i]"
        // Verificando pelo metodo calculateWinner() se existe um vencedor, pois se tiver ele nao pode adicionar a jogada mesmo que o quadrado esteja branco ou a jogada nao exista
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // Verificando qual vai ser o proximo a jogar
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        var col = 0;
        var row = 0;

        // Verificando qual foi a posiçao da jogada
        for (let j = 0; j <= i; j++) {
            if (j % 3 === 0) {
                !j ? (row = 0) : row++;
                col = 0;
            } else {
                col++;
            }
        }

        stepName = ` Jogador: ${squares[i]} col: ${col} / row: ${row}`;

        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    stepName: stepName,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // Modificando a variavel referente a ordem das jogadas
    handleChange = () => {
        this.setState({
            checked: !this.state.checked,
        });
    };

    // Selecionando qual é a jogada a ser mostrada
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history; // Variavel referente a jogadas junto com as posições
        const current = history[this.state.stepNumber]; // Ultima jogada
        const winner = calculateWinner(current.squares); // Verificando se existe um vencedor
        const bold = this.state.stepNumber; // Index da jogada
        var negrito = null; // Varaivel referente a jogada selecionada
        var movesToogle = null; // Variavel com referencia para a ordem das jogadas

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move # ' + move + history[move].stepName : 'Go to game start ';

            if (bold === move) {
                negrito = <b>{desc}</b>;
            } else {
                negrito = desc;
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{negrito}</button>
                </li>
            );
        });

        // Verificando se esta marcada a ordem das jogadas dec.
        if (this.state.checked) {
            movesToogle = moves.slice(0).reverse();
        } else {
            movesToogle = moves;
        }

        let status;

        if (winner) {
            console.log(winner);
            status = 'Winner: ' + winner[3];
        } else {
            // Verificando se deu Velha
            if (this.state.stepNumber === 9) {
                status = 'Gave Old';
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} finishSquares={winner} />
                </div>
                <div className='game-info'>
                    <div>{status}</div>

                    <div className='toogle'>
                        <label className='switch'>
                            <input type='checkbox' onChange={() => this.handleChange()} />
                            <span className='slider round'></span>
                        </label>
                        <span>Descending order</span>
                    </div>

                    <ol>{movesToogle}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

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
            return lines[i].concat(squares[a]);
        }
    }
    return null;
}
