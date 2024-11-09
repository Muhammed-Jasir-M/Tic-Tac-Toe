import { useState } from "react";
import Board from "../components/Board";
import ScoreBoard from "../components/ScoreBoard";

type BoardArray = Array<Array<string | null>>;

type Score = {
    wins: number;
    loses: number;
    ties: number;
};

const TicTacToe = () => {
    const initialBoard = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));

    const [board, setBoard] = useState<BoardArray>(initialBoard);
    const [player, setPlayer] = useState<string>("X");
    const [winner, setWinner] = useState<string | null>(null);
    const [isNoWinner, setIsNoWinner] = useState<boolean>(false);

    const [score, setScore] = useState<Score>({
        wins: 0,
        loses: 0,
        ties: 0
    })

    const checkWinner = (board: BoardArray): string | null => {
        const lines = [
            // Rows
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],

            // Columns
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],

            // Diagnals
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]],
        ];

        for (const line of lines) {
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                return line[0];
            }
        }
        return null;
    };

    const makeComputerMove = (board: BoardArray, playee: string): [number, number] => {
        const computerMoves: Array<[number, number]> = [];

        // Check winning move for computer
        board.forEach((row, rowIndex) => {
            row.forEach((_col, colIndex) => {
                if (!board[rowIndex][colIndex]) {
                    const clonedBoard = board.map((r) => [...r]);
                    clonedBoard[rowIndex][colIndex] = playee;

                    if (checkWinner(clonedBoard) === playee) {
                        computerMoves.unshift([rowIndex, colIndex]);
                    }
                }
            })
        });

        // Check opponents winning move and block it
        const opponent = playee === 'X' ? 'O' : 'X';

        board.some((row, rowIndex) => {
            row.some((_col, colIndex) => {
                if (!board[rowIndex][colIndex]) {
                    const clonedBoard = board.map((r) => [...r]);
                    clonedBoard[rowIndex][colIndex] = opponent;

                    if (checkWinner(clonedBoard) === opponent) {
                        computerMoves.push([rowIndex, colIndex]);
                        return true;
                    }
                    return false;
                }
            })
        });

        // Pick random empty cell
        if (computerMoves.length === 0) {

            // if (!board[1][1]) {
            //     return [1, 1];
            // }

            const emptyCells: Array<[number, number]> = [];
            board.forEach((row, rowIndex) => {
                row.forEach((_col, colIndex) => {
                    if (!board[rowIndex][colIndex]) {
                        emptyCells.push([rowIndex, colIndex]);
                    }
                });
            });

            const randomCell = Math.floor(Math.random() * emptyCells.length);
            return emptyCells[randomCell];
        }

        // Return best move
        return computerMoves[0]
    };

    const handleOnClick = (row: number, col: number) => {
        if (board[row][col] || winner) {
            return;
        }

        const updatedPlayerBoard = board.map((newRow, rowIndex) =>
            newRow.map((cell, colIndex) =>
                rowIndex === row && colIndex === col ? player : cell
            )
        );

        setBoard(updatedPlayerBoard);

        const playerWinner = checkWinner(updatedPlayerBoard);
        setWinner(playerWinner);

        if (playerWinner) {
            setScore((prevScore) => ({
                ...prevScore,
                wins: playerWinner === "X" ? prevScore.wins + 1 : prevScore.wins,
            }));
        }

        const hasNullValue = updatedPlayerBoard.some((row) =>
            row.some((cell) =>
                cell === null
            )
        );

        if (!winner && !hasNullValue) {
            setIsNoWinner(true);
            setScore((prevScore) => ({
                ...prevScore,
                ties: prevScore.ties + 1,
            }));
            return;
        }

        if (!playerWinner && hasNullValue) {
            const nextPlayer = player === 'X' ? 'O' : 'X';
            setPlayer(nextPlayer);

            const computerMove = makeComputerMove(updatedPlayerBoard, nextPlayer);

            setTimeout(() => {
                const updatedComputerBoard = updatedPlayerBoard.map((r, rowIndex) =>
                    r.map((c, colIndex) =>
                        rowIndex === computerMove[0] && colIndex === computerMove[1] ? nextPlayer : c
                    )
                );

                setBoard(updatedComputerBoard);

                const computerWinner = checkWinner(updatedComputerBoard);
                setWinner(computerWinner);

                if (computerWinner) {
                    setScore((prevScore) => ({
                        ...prevScore,
                        loses: computerWinner === "O" ? prevScore.loses + 1 : prevScore.loses,
                    }));
                }

                setPlayer('X');
            }, 300);
        }
    };

    const handleReset = () => {
        setBoard(initialBoard);
        setPlayer("X");
        setWinner(null);
        setIsNoWinner(false);
        setScore({
            wins: 0,
            loses: 0,
            ties: 0
        })
    };

    const handleNewGame = () => {
        setBoard(initialBoard);
        setPlayer("X");
        setWinner(null);
        setIsNoWinner(false);
    };

    return (
        <div className="min-h-screen flex flex-col gap-5 md:gap-3 items-center justify-center py-3">
            <h1 className='w-full text-4xl font-semibold text-center'>Tic Tac Toe</h1>

            <p className={`text-lg font-semibold text-center px-6 py-2 rounded-xl shadow-md
                ${winner
                    ? 'bg-green-500 text-[#1A2A32]'
                    : isNoWinner
                        ? 'bg-[#c6ced2] text-[#1A2A32]'
                        : player === 'X'
                            ? 'bg-[#56e5e0] text-[#1A2A32]'
                            : 'bg-[#F0A824] text-[#1A2A32]'
                }`
            }>
                {
                    winner
                        ? `${winner} WON!!`
                        : isNoWinner
                            ? "It's a Tie!"
                            : player === 'X'
                                ? "X's Turn"
                                : "O's Turn"
                }
            </p>


            <Board board={board} handleClick={handleOnClick} />

            <ScoreBoard score={score} />

            <div className="flex gap-3">
                <button
                    className='px-4 py-2 bg-[#ff9900c3] rounded-md text-lg text-[#ffffff] hover:bg-[#ff9900e6]'
                    type='button'
                    onClick={handleNewGame}
                >
                    New Game
                </button>

                <button
                    className='px-4 py-2 bg-[#2d5f5d] rounded-md text-lg text-[#ffffff] hover:bg-[#2d5f5ddb]'
                    type='button'
                    onClick={handleReset}
                >
                    Reset Game
                </button>
            </div>

        </div>
    );
};

export default TicTacToe;