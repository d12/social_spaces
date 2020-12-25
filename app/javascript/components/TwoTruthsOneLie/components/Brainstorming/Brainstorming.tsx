import React, { useState, useRef } from "react";
import { Cable } from "actioncable";

import {
  Grid,
  Typography,
  Paper,
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
import StatementBox from "./StatementBox";

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
      marginBottom: "40px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    summaryContainer: {
      paddingLeft: "35px",
      paddingRight: "35px",
    },
    submitButton: {
      marginTop: "50px",
    },
    waiting: {
      marginTop: "250px",
    },
    linkWithNoUnderline: {
      background: "none!important",
      border: "none",
      padding: "0!important",
      color: "#069",
      cursor: "pointer",
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

  function submitStatements(): void {
    subscription.send({
      event: ClientEvent.ENTERED_STATEMENTS,
      userId,
      truths: [firstTruth, secondTruth],
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
    return (
      <ActivityCard>
        <Grid container justify="center">
          <Typography variant="h2" className={classes.waiting}>
            Waiting for other players
          </Typography>
        </Grid>
      </ActivityCard>
    )
  }

  const enterStatementsMarkup = step <= 3 && <>
  <ProgressBar step={step} />
    <Typography variant="h2" className={classes.header}>
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
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.confirmationHeader}
    >
      <Typography variant="h2">
          {titleTextForStep(step)}
      </Typography>
      <Typography className={classes.linkWithNoUnderline}>
        I’d like to change my answers
      </Typography>
    </Grid>
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.summaryContainer}
    >
      <StatementBox color="#D9EDFF" statement={firstTruth} />
      <StatementBox color="#D9EDFF" statement={secondTruth} />
      <StatementBox color="#FEE7E7" statement={lie} />
    </Grid>
    <Button onClick={submitStatements} color="secondary" variant="contained" className={classes.submitButton}>
      <strong>Let's Go!</strong>
    </Button>
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
