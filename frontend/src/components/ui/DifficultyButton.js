import Button from "@mui/material/Button";

import styles from "./DifficultButton.module.css";

function DifficultyButton(props) {
  // Clicking on a Difficulty button
  const selectDifficulty = (e) => {
    console.log(e.currentTarget.id);
  }

  // Logic for button color
  let btnStyling = styles.btn;

  switch (props.buttonText) {
    case "Easy":
      btnStyling += " " + styles.btn_easy;
      break;
    case "Medium":
      btnStyling += " " + styles.btn_medium;
      break;
    case "Hard":
      btnStyling += " " + styles.btn_hard;
      break;
    default:
      break;
  }

  return (
    <Button
      className={btnStyling}
      variant="outlined"
      size="large"
      onClick={selectDifficulty}
      id={props.buttonText}
    >
      {props.buttonText}
    </Button>
  );
}

export default DifficultyButton;