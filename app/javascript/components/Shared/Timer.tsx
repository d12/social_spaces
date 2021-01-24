import React, { useEffect, useState, useRef } from "react";

import { Box, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((_theme) => ({
  timerContainer: {
    border: "2px solid red",
    borderRadius: "8px",
    padding: "2px",
    paddingLeft: "8px",
    paddingRight: "8px",
    width: "65px",
    textAlign: "center",
  },
}));

interface Props {
  seconds: number;
}

export function Timer(props: Props) {
  const classes = useStyles();

  const [seconds, setSeconds] = useState<number>(props.seconds);
  const prevPropsSeconds = usePrevious(props.seconds);

  useEffect(() => {
    const intervalID = window.setInterval(() => {
      setSeconds(seconds => seconds - 1);
    }, 1000)

    return () => { clearInterval(intervalID) }
  }, []);

  // If the difference between current seconds and new seconds is less than 2 seconds, don't bother changing the timer
  useEffect(() => {
    if ((Math.abs(seconds - props.seconds) > 2) && props.seconds != prevPropsSeconds)
      setSeconds(props.seconds);
  }, [props, seconds])

  return (
    <Box className={classes.timerContainer}>
      <Typography variant="h3">{formatTime(seconds)}</Typography>
    </Box>
  );
}

function formatTime(totalSeconds: number): string {
  if (totalSeconds < 0)
    totalSeconds = 0;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
}

function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
