import { useState } from "react";
import Board from "../components/Board";

type BoardArray = Array<Array<string | null>>;

const TicTacToe = () => {
    const initialBoard = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));

    const [board, setBoard] = useState<BoardArray>(initialBoard);
    const [player, setPlayer] = useState<string>("X");
    const [winner, setWinner] = useState<string | null>(null);
    const [isNoWinner, setIsNoWinner] = useState<boolean>(false);

    const checkWinner = (board: BoardArray): string | null => {
        const lines = [
            //Rows
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],

            //Columns
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],

            //Diagnals
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

        board.forEach((row, rowIndex) => {
            row.map((_col, colIndex) => {
                if (!board[rowIndex][colIndex]) {
                    const clonedBoard = board.map((r) => [...r]);
                    clonedBoard[rowIndex][colIndex] = playee;

                    if (checkWinner(clonedBoard) === playee) {
                        computerMoves.unshift([rowIndex, colIndex]);
                    }
                }
            })
        });

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

        if (computerMoves.length > 0) {
            return computerMoves[0];
        }

        if (!board[1][1]) {
            return [1, 1];
        }

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
        setPlayer('X');

        const hasNullValue = updatedPlayerBoard.some((row) =>
            row.some((cell) =>
                cell === null
            )
        );

        if (!winner && !hasNullValue) {
            setIsNoWinner(true);
            return;
        }

        if (!playerWinner) {
            const nextPlayer = player === 'X' ? 'O' : 'X';
            const computerMove = makeComputerMove(updatedPlayerBoard, nextPlayer);

            setTimeout(() => {
                const updatedComputerBoard = updatedPlayerBoard.map((r, rowIndex) =>
                    r.map((c, colIndex) =>
                        rowIndex === computerMove?.[0] && colIndex === computerMove[1] ? nextPlayer : c
                    )
                );

                setBoard(updatedComputerBoard);
                const computerWinner = checkWinner(updatedComputerBoard);
                setWinner(computerWinner);
            }, 300);
        }
    };

    const handleReset = () => {
        setBoard(initialBoard);
        setPlayer("X");
        setWinner(null);
        setIsNoWinner(false);
    };

    return (
        <div className="min-h-screen flex flex-col gap-2.5 items-center py-3">
            <h1 className='w-full text-4xl font-semibold text-center pt-3 pb-3'>Tic Tac Toe</h1>

            <Board board={board} handleClick={handleOnClick} />

            {
                winner && (
                    <p className="text-2xl font-medium text-center">
                        {winner === 'X' ? 'YOU WIN!!' : 'YOU LOSE!!'}
                    </p>
                )
            }

            {
                !winner && isNoWinner && <p className="text-2xl font-medium text-center">
                    No One Wins!!
                </p>
            }

            <button
                className='px-4 py-2 bg-blue-800 rounded-md text-lg'
                type='button'
                onClick={handleReset}
            >
                Reset
            </button>
        </div>
    );
};

export default TicTacToe;