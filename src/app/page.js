"use client";
import DraggableDialog from "./modal";
import { useState, useEffect } from "react";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [players, setPlayers] = useState([]);
	const [round, setRound] = useState(1);
	const [showResetModal, setShowResetModal] = useState(false);

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const isWinner = (playerIndex) => {
		// lowest points at the end of round 9 wins'
		const totalScores = calculateCurrentTotalScores();
		const lowestScore = Math.min(...totalScores);
		const winner = totalScores.indexOf(lowestScore);
		return playerIndex === winner;
	};

	useEffect(() => {
		const storedPlayers = localStorage.getItem("players");
		const storedRoundData = localStorage.getItem("rounds");

		if (storedPlayers) {
			setPlayers(JSON.parse(storedPlayers));
			setLoading(false);
		} else {
			setLoading(false);
		}
		if (storedRoundData) {
			const parsedRoundData = JSON.parse(storedRoundData);
			setRound(parsedRoundData.currentRound);
			setLoading(false);
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("players", JSON.stringify(players));
	}, [players]);

	useEffect(() => {
		localStorage.setItem("rounds", JSON.stringify({ currentRound: round }));
	}, [round]);

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

		// Reset the players data
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
		<div
			className={`p-2 flex flex-col flex-wrap justify-center items-center  h-screen w-screen overflow-auto ${loading
				? "bg-gradient-to-br from-slate-900 to-slate-600"
				: "bg-gradient-to-br from-slate-900 to-slate-600"
				}`}>
			{loading ? (
				<div
					className="flex bg-slate-800  p-16 rounded border-2 border-slate-200	opacity-100
					animate-pulse">
					<span
						className="text-white text-3xl
				
					
					">
						Loading...
					</span>
				</div>
			) : (
				<>
					<h1 className="text-3xl font-semibold text-slate-200">
						Golf Card Game{" "}
					</h1>
					<span className=" font-semibold text-green-400 text-sm ">
						{players.length < 2
							? "Please add two or more players to begin"
							: ""}
					</span>
					<div className="flex justify-start items-start mt-4">
						<div className="text-center mx-2 p-4 rounded shadow space-y-2 inline-flex flex-col bg-slate-900">
							{players.length < 1 ? (
								"" // If there are no players, do not show the round
							) : round ? (
								<div className="bg-slate-700 text-slate-50 p-1 text-xl rounded">
									<span className="custom-animation">
										Round {round}
									</span>
								</div>
							) : (
								""
							)}

							{players.length < 1 ? (
								""
							) : (
								""
							)}
							<button
								className={`px-4 py-2 bg-blue-500 text-slate-900 rounded hover:bg-blue-600 text-2xl font-bold ${players.length < 2
									? "hidden"
									: "cursor-pointer"
									}`}
								onClick={() => {
									// check if all of the users got a score for the current round
									if (isRoundComplete()) {
										setRound((prevRound) => prevRound + 1);
										// set new localStorage data
										localStorage.setItem(
											"players",
											JSON.stringify(players)
										);
									}
								}}>
								Next Turn
							</button>
							<button
								className={` bg-green-500 text-slate-900 font-bold rounded hover:bg-green-600 text-2xl ${round < 2 ? "cursor-pointer" : "hidden"
									}`}
								onClick={() => {
									if (round === 1) {
										handleAddPlayer(
											prompt("Enter player name")
										);
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
								className={`bg-red-500 text-slate-900 px-4 py-2 rounded hover:bg-red-600 text-2xl font-bold ${players.length < 2
									? "hidden"
									: "cursor-pointer"
									}`}>
								Reset Game
							</button>
						</div>

						<div className="flex flex-col items-start justify-center rounded shadow bg-slate-900">
							{players.map((player, playerIndex) => (
								<div
									key={playerIndex}
									className="p-2 rounded shadow text-lg m-4 border-b-2 border-slate-700">
									<span className="text-lg font-semibold mb-2 text-slate-50 p-1 rounded">
										{capitalizeFirstLetter(player.name)}{" "}
										<span className="text-md mt-2 text-green-600">
											Total Score:{" "}
											{calculateTotalScore(player.scores)}
										</span>
									</span>
									<div className="grid grid-cols-9 gap-2">
										{Array.from(
											{ length: round },
											(_, index) => (
												<input
													key={index}
													disabled={
														round === 1 ? false : index + 1 === round
															? false : true
													}

													className="p-1 rounded shadow bg-slate-800 text-center custom-animation"
													type="text"
													placeholder={`R${index + 1
														}`}
													value={
														player.scores[index] ||
														""
													}
													onChange={(e) =>
														handleScoreChange(
															playerIndex,
															parseInt(
																e.target.value
															)
														)
													}
												/>
											)
										)}
									</div>

								</div>
							))}

							<DraggableDialog // Render your Modal component
								open={showResetModal}
								handleClose={handleCancelReset}
								handleConfirm={handleConfirmReset}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
