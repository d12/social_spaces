import React, { useState } from "react";
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
    }
  })
);

export function Brainstorming({ userId, subscription, gameState, currentUserData }: Props) {
  const classes = useStyles(useTheme());
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false);

  const requiredErrorMessage = "This field is required";
  const required = [
    notEmpty(requiredErrorMessage),
    notEmptyString(requiredErrorMessage),
  ];

  const { fields, submit, dirty, reset } = useForm({
    fields: {
      firstTruth: useField<string>({ value: "", validates: required }),
      secondTruth: useField<string>({ value: "", validates: required }),
      lie: useField<string>({ value: "", validates: required }),
    },
    onSubmit: async ({ firstTruth, secondTruth, lie }) => {
      submitStatements([firstTruth, secondTruth, lie]);
      return submitSuccess();
    },
  });

  function openExamples() {
    setExamplesOpen(true);
  }

  function handleCloseExamplesDialog() {
    setExamplesOpen(false);
  }

  if (currentUserData.statements != null) {
    return <p>Waiting for other players to finish...</p>;
  }

  return (
    <>
      <ActivityCard>
        <ProgressBar step={2} />
        <Typography variant="h4" className={classes.header}>
          First, begin by telling us something that is true about yourself
        </Typography>
        <Grid
          container
          direction="row"
          className="form"
          justify="center"
          alignItems="flex-end"
        >
          <TextField label="Type here" className={classes.textBox} />
          <Button variant="contained" className={classes.button}>
            <img src={arrow} />
          </Button>
        </Grid>
        <Typography className={classes.exampleText}>
          Can’t think of anything? Choose from some examples <button className={classes.exampleLink} onClick={openExamples}>here</button>.
        </Typography>
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

  function submitStatements(statements: string[]): void {
    const lie = statements[2];
    const truths = statements.slice(0, 2);

    subscription.send({
      event: ClientEvent.ENTERED_STATEMENTS,
      userId,
      truths,
      lie,
    });
  }
}
