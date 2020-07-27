import React from "react";
import { PlayingCard, CardProperties, CardSize } from "./PlayingCard";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  cards: CardProperties[];
  size: CardSize;
  overlap?: boolean;
}

export default function PlayingCardHand({ cards, size, overlap }: Props) {
  if (cards === [] || cards == undefined) {
    return null;
  }

  const cardLeftMargin = overlap ? size * -0.63 : size * 0.1;

  const useStyles = makeStyles((_theme) => ({
    hand: {},
    card: {
      transformOrigin: "bottom left",
      "&:nth-child(1)": {
        // transform: "rotate(-36deg)",
      },
      "&:nth-child(2)": {
        marginLeft: cardLeftMargin + "px",
        // transform: "rotate(-24deg)",
      },
      "&:nth-child(3)": {
        marginLeft: cardLeftMargin + "px",
        // transform: "rotate(-12deg)",
      },
      "&:nth-child(4)": {
        marginLeft: cardLeftMargin + "px",
        // transform: "rotate(0deg)",
      },
      "&:nth-child(5)": {
        marginLeft: cardLeftMargin + "px",
        // transform: "rotate(12deg)",
      },
    },
  }));

  const classes = useStyles();

  function cardsFromProperties(cards: CardProperties[], size: CardSize) {
    return cards.map((card) => {
      return (
        <PlayingCard
          key={`card-${card.number}-${card.suit}`}
          size={size}
          number={card.number}
          suit={card.suit}
          faceDown={card.faceDown}
          className={classes.card}
        />
      );
    });
  }

  const cardsMarkupArray = cardsFromProperties(cards, size);

  return (
    <Box display="flex" className={classes.hand}>
      {cardsMarkupArray}
    </Box>
  );
}
