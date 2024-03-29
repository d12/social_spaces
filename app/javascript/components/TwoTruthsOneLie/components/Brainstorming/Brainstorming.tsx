import React, { useState, useRef, useEffect } from "react";
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
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { arrow } from "../../../../images";

export interface Props {
  userId: number;
  subscription: Cable;
  gameState: GameState;
  currentUserData: ActivityUser;
}

const useStyles = makeStyles(
  () => ({
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
    },
    dialog: {
    },
    example: {
      color: "#000000",
      marginBottom: "5px",
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

export function Brainstorming({ userId, subscription, currentUserData }: Props) {
  const classes = useStyles(useTheme());
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const [firstTruth, setFirstTruth] = useState<string>("");
  const [secondTruth, setSecondTruth] = useState<string>("");
  const [lie, setLie] = useState<string>("");

  const textboxRefs = [
    useRef<HTMLInputElement>(),
    useRef<HTMLInputElement>(),
    useRef<HTMLInputElement>(),
  ];

  useEffect(() => {
    const textbox = textboxRefs[step - 1] && textboxRefs[step - 1].current;
    if(!textbox) return;

    textbox.focus();
  }, [step]);

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

  function submitIfEnter(e: { keyCode: number; }) {
    if(e.keyCode == 13) {
      clickNextButton();
    }
  }

  function clickNextButton() {
    if(!textboxRefs[step - 1].current) {
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
        inputRef={textboxRefs[0]}
        value={firstTruth}
        onChange={(e) => setFirstTruth(e.target.value)}
        onKeyDown={submitIfEnter}
        style={{display: step == 1 ? "block" : "none"}}
        fullWidth={true}
      />
      <TextField
        label="Type here"
        className={classes.textBox}
        autoComplete="off"
        inputRef={textboxRefs[1]}
        value={secondTruth}
        onChange={(e) => setSecondTruth(e.target.value)}
        onKeyDown={submitIfEnter}
        style={{display: step == 2 ? "block" : "none"}}
        fullWidth={true}
      />
      <TextField
        label="Type here"
        className={classes.textBox}
        autoComplete="off"
        inputRef={textboxRefs[2]}
        value={lie}
        onChange={(e) => setLie(e.target.value)}
        onKeyDown={submitIfEnter}
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
      <Typography className={classes.linkWithNoUnderline} onClick={() => setStep(1)}>
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
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Sample Statements
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} />
          <Typography className={classes.example}>I love horror movies</Typography>
          <Typography className={classes.example}>I have never been ice skating</Typography>
          <Typography className={classes.example}>I am afraid of birds</Typography>
          <Typography className={classes.example}>I hate chocolate</Typography>
          <Typography className={classes.example}>I’ve never had the chicken pox</Typography>
          <Typography className={classes.example}>I own a convertable</Typography>
          <Typography className={classes.example}>I can juggle</Typography>
          <Typography className={classes.example}>I’ve climbed Mount Everest</Typography>
          <Typography className={classes.example}>I can’t drink coffee</Typography>
          <Typography className={classes.example}>I’m actually an owl</Typography>
        </DialogContent>
        <DialogActions style={{justifyContent: "center", marginTop: "10px"}}>
          <Button onClick={handleCloseExamplesDialog} color="secondary" variant="contained">
            Looks good!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
