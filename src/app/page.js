"use client";
import DraggableDialog from "./modal";
import { useState, useEffect } from "react";

export default function Home() {
	const [players, setPlayers] = useState([]);
	const [round, setRound] = useState(1);
	const [showResetModal, setShowResetModal] = useState(false);
	const [dots, setDots] = useState(".");

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prevDots) => {
				if (prevDots.length === 3) {
					return "..."; // Display three dots
				} else if (prevDots === "...") {
					return "."; // Reset after a delay
				} else {
					return prevDots + ".";
				}
			});
		}, 500); // Interval for adding dots

		return () => {
			clearInterval(interval);
		};
	}, [dots]);

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

		// Reset the players data
	};

	const handleConfirmReset = () => {
		setShowResetModal(false); // Close the reset modal
		setPlayers([]); // Reset the players data
		setRound(1); // Reset the round
		// start the dots again
		setDots(".");
	};

	const handleCancelReset = () => {
		setShowResetModal(false); // Close the reset modal
	};

	return (
		<div className="m-2 flex flex-col flex-wrap justify-center items-center">
			<h1 className="text-3xl font-semibold text-slate-200">
				Golf Card Game{" "}
				<span className=" font-semibold text-green-500">
					{players.length < 2
						? "- Add two or more players to begin" + dots
						: ""}
				</span>
			</h1>

			<div className=" flex justify-start space-x-4 items-start mt-4">
				<div className="mx-2 p-4 rounded shadow space-y-2 inline-flex flex-col bg-slate-900">
					<div className="bg-slate-700 text-white p-2 text-xl rounded flex justify-center">
						{round ? (
							<>
								Round ‎
								<span className="font-bold text-green-500">
									{round}
								</span>
							</>
						) : (
							""
						)}
					</div>
					<div id="totalScores">
						<h2 className="font-semibold text-slate-200 text-3xl underline">
							Score:
						</h2>
						{calculateCurrentTotalScores().map((total, index) => (
							<p key={index} className="text-lg text-slate-200 ">
								<strong>{players[index].name}</strong>: {total}
							</p>
						))}
					</div>

					<button
						className={`px-4 py-2 bg-blue-500 text-slate-900 rounded hover:bg-blue-600 text-2xl font-bold ${
							players.length < 2 ? "hidden" : "cursor-pointer"
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
						className={`px-4 py-2 bg-green-500 text-slate-900 font-bold rounded hover:bg-green-600 text-2xl ${
							round < 2 ? "cursor-pointer" : "hidden"
						}`}
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
						className={`bg-red-500 text-slate-900 px-4 py-2 rounded hover:bg-red-600 text-2xl font-bold ${
							players.length < 2 ? "hidden" : "cursor-pointer"
						}`}>
						Reset Game
					</button>
				</div>
				<div className="flex flex-col max-w-7xl">
					{players.map((player, playerIndex) => (
						<div
							key={playerIndex}
							className="p-2 rounded shadow bg-slate-900 mb-2">
							<span className="text-lg font-semibold mb-2 text-green-600 p-1 rounded">
								{capitalizeFirstLetter(player.name)}{" "}
							</span>
							<div className="flex break-words flex-wrap space-x-1 justify-center items-center">
								{Array.from({ length: round }, (_, index) => (
									<input
										key={index}
										className="rounded shadow w-14 bg-slate-800 p-2"
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
							{/* <p className="text-sm mt-2">
								Total Score:{" "}
								{calculateTotalScore(player.scores)}
							</p> */}
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
