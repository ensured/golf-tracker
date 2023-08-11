"use client";
import DraggableDialog from "./modal";
import { useState, useEffect } from "react";

export default function Home() {
	const [players, setPlayers] = useState([]);
	const [round, setRound] = useState(1);
	const [showResetModal, setShowResetModal] = useState(false);

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
		if (!playerName) return;
		setPlayers((prevPlayers) => [
			...prevPlayers,
			{ name: playerName, scores: [] },
		]);
	};

	const isRoundComplete = () => {
		return players.every(
			(player) => player.scores[round - 1] !== undefined
		);
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

	const handleReset = () => {
		setShowResetModal(true); // Show the reset modal
	};

	const handleConfirmReset = () => {
		setShowResetModal(false); // Close the reset modal
		setPlayers([]); // Reset the players data
		setRound(1); // Reset the round
	};

	const handleCancelReset = () => {
		setShowResetModal(false); // Close the reset modal
	};

	return (
		<div className="m-2">
			<h1 className="text-3xl font-semibold text-white">
				Golf Card Game Score Tracker
			</h1>

			<div className="w-full flex justify-start space-x-4 items-start mt-4">
				<div className="mx-2 bg-white p-4 rounded shadow space-y-2 inline-flex flex-col">
					<button
						className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-2xl ${
							players.length < 2 ? "collapse" : "cursor-pointer"
						}`}
						onClick={() => {
							// check if all of the users got a score for the current round
							if (isRoundComplete()) {
								setRound((prevRound) => prevRound + 1);
							}
						}}>
						Next Turn
					</button>
					<button
						className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-2xl"
						dd
						Pla
						onClick={() => {
							if (round === 1) {
								handleAddPlayer(prompt("Enter player name"));
							} else {
								alert(
									"Cannot add a new player while the game is in progress."
								);
							}
						}}>
						Add Player
					</button>
					<button
						onClick={handleReset}
						className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-2xl ${
							players.length < 2 ? "collapse" : "cursor-pointer"
						}`}>
						Reset Game
					</button>

					<div id="totalScores">
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
				<div className="flex flex-col space-y-4">
					{players.map((player, playerIndex) => (
						<div
							key={playerIndex}
							className="bg-white p-4 rounded shadow">
							<h3 className="text-lg font-semibold mb-2 text-slate-600">
								{player.name}
							</h3>
							<div className="flex space-x-1 break-words flex-wrap">
								{Array.from({ length: round }, (_, index) => (
									<input
										key={index}
										className="border rounded p-1 text-center text-slate-500 w-16 mb-1"
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

					<DraggableDialog // Render your Modal component
						open={showResetModal}
						handleClose={handleCancelReset}
						handleConfirm={handleConfirmReset}
					/>
				</div>
			</div>
		</div>
	);
}
