import React, { useState, useRef } from "react";
import { Cable } from "actioncable";
import {
  useForm,
  useField,
  submitSuccess,
  notEmpty,
  notEmptyString,
} from "@shopify/react-form";

import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";

import { ActivityCard } from "../../../Shared";
import ProgressBar from "./ProgressBar";

import { ClientEvent } from "../../subscription-manager";

import { GameState, ActivityUser } from "../../TwoTruthsOneLie";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import { arrow } from "../../../../images";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
  currentUserData: ActivityUser;
}

const useStyles = makeStyles(
  (theme) => ({
    header: {
      marginTop: "120px",
      marginBottom: "60px",
    },
    textBox: {
      width: "400px",
    },
    button: {
      color: "#FFFFFF",
      backgroundColor: "#74A2CC",
      maxHeight: "40px",
      minHeight: "40px",
      maxWidth: "40px",
      minWidth: "40px",
      padding: 0,
      marginLeft: "20px",
    },
    exampleText: {
      marginTop: "10px",
      paddingRight: "83px",
      fontSize: "0.9rem",
    },
    exampleLink: {
      background: "none!important",
      border: "none",
      padding: "0!important",
      color: "#069",
      textDecoration: "underline",
      cursor: "pointer",
    },
    confirmationHeader: {
      marginTop: "30px",
      marginBottom: "60px",
      marginLeft: "20px",
      marginRight: "auto",
    }
  })
);

function titleTextForStep(step: number) {
  switch(step) {
    case 1:
      return "First, begin by telling us something that is true about yourself";

    case 2:
      return "Tell us another thing that is true about yourself!";

    case 3:
      return "Last step! What’s something that isn’t true about yourself?";

    case 4:
      return "Here are your two truths and a lie";
  }
}

export function Brainstorming({ userId, subscription, gameState, currentUserData }: Props) {
  const classes = useStyles(useTheme());
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const [firstTruth, setFirstTruth] = useState<string>(null);
  const [secondTruth, setSecondTruth] = useState<string>(null);
  const [lie, setLie] = useState<string>(null);

  const textBox = useRef<HTMLInputElement>(null);

  function openExamples() {
    setExamplesOpen(true);
  }

  function handleCloseExamplesDialog() {
    setExamplesOpen(false);
  }

  function submitStatements(truths: string[], lie: string): void {
    subscription.send({
      event: ClientEvent.ENTERED_STATEMENTS,
      userId,
      truths,
      lie,
    });
  }

  function clickNextButton() {
    if(!textBox.current) {
      return;
    }

    setStep(e => e + 1);
  }

  if (currentUserData.statements != null) {
    return <p>Waiting for other players to finish...</p>;
  }

  const enterStatementsMarkup = step <= 3 && <>
  <ProgressBar step={step} />
    <Typography variant="h4" className={classes.header}>
      {titleTextForStep(step)}
    </Typography>
    <Grid
      container
      direction="row"
      className="form"
      justify="center"
      alignItems="flex-end"
    >
      <TextField
        label="Type here"
        className={classes.textBox}
        autoComplete="off"
        inputRef={textBox}
        value={firstTruth}
        onChange={(e) => setFirstTruth(e.target.value)}
        style={{display: step == 1 ? "block" : "none"}}
        fullWidth={true}
      />
      <TextField
        label="Type here"
        className={classes.textBox}
        autoComplete="off"
        inputRef={textBox}
        value={secondTruth}
        onChange={(e) => setSecondTruth(e.target.value)}
        style={{display: step == 2 ? "block" : "none"}}
        fullWidth={true}
      />
      <TextField
        label="Type here"
        className={classes.textBox}
        autoComplete="off"
        inputRef={textBox}
        value={lie}
        onChange={(e) => setLie(e.target.value)}
        style={{display: step == 3 ? "block" : "none"}}
        fullWidth={true}
      />
      <Button variant="contained" className={classes.button} onClick={clickNextButton}>
        <img src={arrow} />
      </Button>
    </Grid>
    <Typography className={classes.exampleText}>
      Can’t think of anything? Choose from some examples <button className={classes.exampleLink} onClick={openExamples}>here</button>.
    </Typography>
  </>;

  const confirmationMarkup = step > 3 && <>
    <Typography variant="h4" className={classes.confirmationHeader}>
        {titleTextForStep(step)}
    </Typography>
  </>;

  return (
    <>
      <ActivityCard>
        {enterStatementsMarkup}
        {confirmationMarkup}
      </ActivityCard>
      <Dialog
        open={examplesOpen}
        onClose={handleCloseExamplesDialog}
      >
      <DialogTitle><strong>Sample Statements</strong></DialogTitle>
        <DialogContent>
          <Paper elevation={0} />
          <DialogContentText>
            <div>I love horror movies</div>
            <div>I have never been ice skating</div>
            <div>I am afraid of birds</div>
            <div>I hate chocolate</div>
            <div>I’ve never had the chicken pox</div>
            <div>I own a convertable</div>
            <div>I can juggle</div>
            <div>I’ve climbed Mount Everest</div>
            <div>I can’t drink coffee</div>
            <div>I’m actually an owl</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExamplesDialog} color="secondary" variant="contained">
            Looks good!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
