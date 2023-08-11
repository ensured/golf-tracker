import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}>
			<Paper {...props} />
		</Draggable>
	);
}

function DraggableDialog({ open, handleClose, handleConfirm }) {
	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby="draggable-dialog-title">
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title">
					Reset Game
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to reset the game? This action
						cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleConfirm}>Reset</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default DraggableDialog;
