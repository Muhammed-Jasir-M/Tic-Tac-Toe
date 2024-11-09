type Score = {
    wins: number;
    ties: number;
    loses: number;
};

type ScoreBoardProps = {
    score: Score;
}

const ScoreBoard = ({ score }: ScoreBoardProps) => {
    return (
        <div className="flex gap-2.5 items-center">
            <div className="flex flex-col items-center justify-center w-[90px] py-0.5 bg-[#56e5e0] text-[#1A2A32] rounded-md">
                <span className="text-sm font-semibold">X (YOU)</span>
                <strong className="text-2xl">{score.wins}</strong>
            </div>

            <div className="flex flex-col items-center justify-center w-[90px] py-0.5 bg-[#c6ced2] text-[#1A2A32] rounded-md">
                <span className="text-sm font-semibold">Ties</span>
                <strong className="text-2xl">{score.ties}</strong>
            </div>

            <div className="flex flex-col items-center justify-center w-[90px] py-0.5 bg-[#F0A824] text-[#1A2A32] rounded-md">
                <span className="text-sm font-semibold">Y (CPU)</span>
                <strong className="text-2xl">{score.loses}</strong>
            </div>
        </div>
    )
}

export default ScoreBoard