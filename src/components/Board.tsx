type BoardProps = {
    board: Array<Array<string | null>>,
    handleClick: (row: number, col: number) => void;
}

const Board = ({ board, handleClick }: BoardProps) => {
    return (
        <div className="flex flex-col gap-1.5 items-center justify-center">
            {
                board.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex gap-1.5 items-center"
                    >
                        {
                            row.map((cell, colIndex) => (
                                <button
                                    key={colIndex}
                                    className={`w-24 h-24 rounded text-5xl font-bold text-white border-none outline-none cursor-pointer
                                        ${cell === 'X' ? 'bg-green-500' : cell === 'O' ? 'bg-pink-500' : 'bg-[#284754]'}`}
                                    onClick={() => handleClick(rowIndex, colIndex)}
                                >
                                    {cell}
                                </button>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Board