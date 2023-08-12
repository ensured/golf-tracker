"use client";
import DraggableDialog from "./modal";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [players, setPlayers] = useState([]);
	const [round, setRound] = useState(1);
	const [showResetModal, setShowResetModal] = useState(false);

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const calculateCurrentTotalScores = useCallback(() => {
		return players.map((player) => {
			return calculateTotalScore(player.scores);
		});
	}, [players]);

	const isWinner = useCallback((playerIndex) => {
		// lowest points at the end of round 9 wins'
		const totalScores = calculateCurrentTotalScores();
		const lowestScore = Math.min(...totalScores);
		const winner = totalScores.indexOf(lowestScore);
		return playerIndex === winner;
	}, [calculateCurrentTotalScores]);

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
		if (round === 10) {
			const winner = players.findIndex((player, index) =>
				isWinner(index)
			);
			const winnerMessage = "Game Over, the winner is " + players[winner].name;
			alert(winnerMessage);
			setRound(1);
			setPlayers([]);
		}

		localStorage.setItem("rounds", JSON.stringify({ currentRound: round }));
	}, [round, isWinner, players]);



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
		<div className="min-h-screen bg-slate-900">
			<div
				className={`p-2 flex flex-col flex-wrap justify-center items-center overflow-auto bg-slate-900`}>
				{loading ? (
					<div
						className="flex bg-slate-800  p-16 rounded -2 border-slate-200	opacity-100
					animate-pulse">
						<span
							className="text-white text-3xl
					">
							Loading...
						</span>
					</div>
				) : (
					<>
						<span className=" font-semibold text-green-400 text-sm ">
							{players.length < 2
								? "Please add two or more players to begin"
								: ""}
						</span>
						<div className="flex">
							<div className="text-center rounded shadow space-y-2 inline-flex flex-col">
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
										if (round === 10) {


										}
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
									{round === 9 ? "Finish Game" : "Next Round"}
								</button>
								<button
									className={`p-3 bg-green-500 text-slate-900 font-bold rounded hover:bg-green-600 text-2xl ${round < 2 ? "cursor-pointer" : "hidden"
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

							<div className="flex flex-col rounded shadow bg-slate-900">
								{players.map((player, playerIndex) => {

									const isLeader = isWinner(playerIndex);
									return (
										<div
											key={playerIndex}
											className="p-2 rounded shadow text-lg bg-slate-950 mb-1 ml-2">

											<span className="text-lg font-semibold mb-2 text-purple-600 p-1 rounded">

												{capitalizeFirstLetter(player.name)}{" "}
												{isLeader && (
													<span className="relative text-2xl"
													>
														👑
													</span>
												)}

												<span className="text-md text-slate-100">
													Total Score:{" "}
													{calculateTotalScore(player.scores)}
												</span>

											</span>
											<div className="grid gap-1 text-center grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
												{Array.from(
													{ length: round },
													(_, index) => (
														<input
															key={index}
															disabled={
																round === 1 ? false : index + 1 === round
																	? false : true
															}

															className="min-w-full rounded shadow bg-slate-800 text-center custom-animation"
															type="number"
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
									);
								})}

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
		</div>
	);
}
