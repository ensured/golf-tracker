"use client";

import { useState, useEffect } from "react";

export default function Home() {
	const [players, setPlayers] = useState([]);
	const [round, setRound] = useState(1);

	useEffect(() => {
		const storedPlayers = localStorage.getItem("players");
		if (storedPlayers) {
			setPlayers(JSON.parse(storedPlayers));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("players", JSON.stringify(players));
	}, [players]);

	const handleAddPlayer = (playerName) => {
		setPlayers((prevPlayers) => [
			...prevPlayers,
			{ name: playerName, scores: [] },
		]);
	};

	const handleScoreChange = (playerIndex, score) => {
		setPlayers((prevPlayers) => {
			const updatedPlayers = [...prevPlayers];
			updatedPlayers[playerIndex].scores[round - 1] = score;
			return updatedPlayers;
		});
	};

	const calculateTotalScore = (playerScores) => {
		return playerScores.reduce((total, score) => total + (score || 0), 0);
	};

	const calculateCurrentTotalScores = () => {
		return players.map((player) => calculateTotalScore(player.scores));
	};

	const resetGame = () => {
		localStorage.removeItem("players");
		setPlayers([]);
		setRound(1);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-10">
			<h1 className="text-3xl font-semibold mb-6 text-slate-900">
				Golf Card Game Score Tracker
			</h1>
			<div className="w-full flex justify-center">
				<div className="flex flex-col space-y-4">
					{players.map((player, playerIndex) => (
						<div
							key={playerIndex}
							className="bg-white p-4 rounded shadow">
							<h3 className="text-lg font-semibold mb-2 text-slate-600">
								{player.name}
							</h3>
							<div className="flex space-x-4">
								{Array.from({ length: round }, (_, index) => (
									<input
										key={index}
										className="border rounded p-1 w-12 text-center text-slate-500"
										type="number"
										placeholder={`R${index + 1}`}
										value={player.scores[index] || ""}
										onChange={(e) =>
											handleScoreChange(
												playerIndex,
												parseInt(e.target.value)
											)
										}
									/>
								))}
							</div>
							<p className="text-sm mt-2">
								Total Score:{" "}
								{calculateTotalScore(player.scores)}
							</p>
						</div>
					))}
				</div>
			</div>
			<div className="mt-6 flex space-x-4">
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-2xl"
					disabled={players.length === 0}
					onClick={() => setRound(round + 1)}>
					Next Round
				</button>
				<button
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-2xl"
					onClick={() =>
						handleAddPlayer(prompt("Enter player name"))
					}>
					Add Player
				</button>
				<button
					onClick={resetGame}
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4 text-2xl">
					Reset Game
				</button>
			</div>
			<div className="mt-6 bg-white p-4 rounded shadow space-y-2">
				<h2 className="font-semibold text-slate-800 text-3xl underline">
					Total Scores
				</h2>
				{calculateCurrentTotalScores().map((total, index) => (
					<p key={index} className="text-lg text-slate-700">
						{players[index].name}: {total}
					</p>
				))}
			</div>
		</div>
	);
}
