import React, { useEffect, useState } from "react";

import { Box, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((_theme) => ({
timerContainer: {
    border: "2px solid red",
    borderRadius: "8px",
    padding: "2px",
    paddingLeft: "8px",
    paddingRight: "8px",
    },
}));

interface Props {
  seconds: number;
}

function formatTime(totalSeconds: number): string {
    if(totalSeconds < 0)
        totalSeconds = 0;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
}

export function Timer(props: Props) {
  const classes = useStyles();

  const [seconds, setSeconds] = useState<number>(props.seconds);

  useEffect(() => {
    const intervalID = window.setInterval(() => {
        setSeconds(seconds => seconds - 1);
    }, 1000)

    return () => { clearInterval(intervalID) }
  }, []);

  useEffect(() => {
    setSeconds(props.seconds);
  }, [props])

  return (
    <Box className={classes.timerContainer}>
        <Typography variant="h3">{formatTime(seconds)}</Typography>
    </Box>
  );
}
