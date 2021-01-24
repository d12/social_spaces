import React from "react";

import {
  Grid,
  Typography,
  Box,
} from "@material-ui/core";

import {
  blobBlue,
  blobGreen,
  blobPink,
  blobPurple,
  blobYellow
} from "../../images";

import { makeStyles, useTheme } from "@material-ui/core/styles";

function blobForId(id: number) {
  switch (id % 5) {
    case 0: return blobBlue;
    case 1: return blobGreen;
    case 2: return blobYellow;
    case 3: return blobPurple;
    case 4: return blobPink;
  }
}

const useStyles = makeStyles((_theme) => ({
  container: {
    marginRight: "8px",
    height: "100%",
    overflowY: "auto",
    flex: "0 0 200px",
  },
  scoreBox: {
    height: "135px",
    marginBottom: "20px",
    paddingTop: "20px",
    paddingLeft: "15px",
    paddingRight: "15px",
    backgroundColor: "#F2F9FF",
    borderRadius: "10px",
  },
  outlinedScoreBox: { // TODO: Get SASS working
    height: "130px",
    marginBottom: "20px",
    paddingTop: "20px",
    paddingLeft: "15px",
    paddingRight: "15px",
    backgroundColor: "#F2F9FF",
    borderRadius: "10px",
    borderColor: "#000000",
    borderStyle: "solid"
  },
  name: {
    marginTop: "8px",
    width: "150px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: "1rem",
    fontWeight: 600,
  },
  blob: {
    marginRight: "10px",
    height: "35px",
    width: "35px",
  },
  scoreTextContainer: {
    backgroundColor: "#74A2CC",
    borderRadius: "7px",
    width: "100%",
    height: "40px",
    marginTop: "20px",
    paddingLeft: "15px",
    color: "#FFFFFF",
    flexWrap: "nowrap",
  },
  scoreText: {
    fontSize: "18px",
    marginRight: "12px",
  }
}));

export interface PlayerScore {
  name: string;
  score: number;
  id: number;
}

interface Props {
  scores: PlayerScore[];
  selectedIndex: number;
}

export function ScoreBoard({ scores, selectedIndex }: Props) {
  const classes = useStyles();

  const scoresMarkup = scores.map((score, index) => {
    return (
      <Box
        className={index == selectedIndex ? classes.outlinedScoreBox : classes.scoreBox}
        key={index}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          style={{ flexWrap: "nowrap" }}
        >
          <img src={blobForId(score.id)} className={classes.blob} />
          <Typography className={classes.name}>{score.name}</Typography>
        </Grid>
        <Grid
          container
          direction="row"
          className={classes.scoreTextContainer}
          alignItems="center"
        >
          <Typography className={classes.scoreText}>Score:</Typography>
          <Typography className={classes.scoreText}><strong>{score.score}</strong></Typography>
        </Grid>
      </Box>
    );
  });

  return (
    <div
      className={classes.container}
    >
      {scoresMarkup}
    </div>
  );
}
