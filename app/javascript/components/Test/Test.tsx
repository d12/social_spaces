import React, { useState } from "react";

import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles(
  () => ({
    boxBlue: {
      height: "100px",
      width: "100px",
      backgroundColor: "blue",
    },
    boxBlueEnter: {
      opacity: 0,
    },
    boxBlueEnterActive: {
      transition: "opacity 1000ms ease-in-out",
      opacity: 1,
    },
    boxBlueExit: {
      opacity: 1,
    },
    boxBlueExitActive: {
      transition: "opacity 1000ms ease-in-out",
      opacity: 0,
    },
    boxRed: {
      height: "100px",
      width: "100px",
      backgroundColor: "red"
    }
  })
);

export default function Test() {
  const classes = useStyles();
  const [step, setStep] = useState<number>(0);

  const transitionStyles = {
    enter: classes.boxBlueEnter,
    enterActive: classes.boxBlueEnterActive,
    exit: classes.boxBlueExit,
    exitActive: classes.boxBlueExitActive,
  };

  return (<>
    <Button onClick={() => setStep(step => step + 1)}>Animate</Button>

    <SwitchTransition>
      <CSSTransition
        timeout={1000}
        classNames={transitionStyles}
        onEntered={() => setTimeout(() => setStep(step => step + 1), 2000)}
        key={step}
      >
        <Box className={step == 1 ? classes.boxBlue : classes.boxRed} />
      </CSSTransition>
    </SwitchTransition>
  </>);
}
