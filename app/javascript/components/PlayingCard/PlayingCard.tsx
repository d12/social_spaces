import React, { useEffect, useState, useRef } from "react";
import { Typography, Card, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  cardClub,
  cardSpade,
  cardDiamond,
  cardHeart,
  cardBack,
} from "../../images";

export enum CardSuit {
  Club,
  Spade,
  Heart,
  Diamond,
}

export enum CardSize {
  Giant = 250,
  Large = 175,
  Medium = 100,
  Small = 70,
}

export interface CardProperties {
  number: string;
  suit: CardSuit;
  faceDown?: boolean;
}

export interface Props {
  number: string;
  suit: CardSuit;
  size: CardSize;
  className?: string;
  faceDown?: boolean;
}

const suitToImageMap = {
  [CardSuit.Club]: cardClub,
  [CardSuit.Spade]: cardSpade,
  [CardSuit.Heart]: cardHeart,
  [CardSuit.Diamond]: cardDiamond,
};

export function PlayingCard({
  number,
  suit,
  size,
  className,
  faceDown,
}: Props) {
  const [faceDownState, setFaceDownState] = useState<boolean>(faceDown);

  const didMountRef = useRef(false);

  useEffect(() => {
    setFaceDownState(faceDown);

    if (didMountRef.current) {
      console.log("face up changed for the " + number + " of " + suit);
    } else {
      didMountRef.current = true;
    }
  }, [faceDown]);

  // Constants used for formatting cards
  const heightToWidthRatio = 1.4;
  const cardWidth = size;
  const cardHeight = cardWidth * heightToWidthRatio;

  const cardWidthPx = cardWidth + "px";
  const cardHeightPx = cardHeight + "px";

  const numberFontSize = cardWidth * 0.02 + "em";
  const numberMarginTop = cardWidth * 0.06 + "px";
  const numberMarginLeft = cardWidth * 0.015 + "px";
  const numberWidth = cardWidth * 0.3 + "px";

  const suitSmallWidth = cardWidth * 0.012 + "em";
  const suitSmallHeight = cardWidth * 0.012 + "em";
  const suitSmallLeftMargin = cardWidth * 0.07 + "px";

  const suitLargeWidth = cardWidth * 0.047 + "em";
  const suitLargeHeight = cardWidth * 0.047 + "em";
  const suitLargeTopMargin = cardWidth * 0.07 + "px";
  const suitLargeLeftMargin = cardWidth * 0.21 + "px";

  const useStyles = makeStyles((_theme) => ({
    card: {
      maxHeight: cardHeightPx,
      minHeight: cardHeightPx,
      maxWidth: cardWidthPx,
      minWidth: cardWidthPx,
      position: "absolute",
      backfaceVisibility: "hidden",
      "-webkit-backface-visibility": "hidden",
    },
    number: {
      fontSize: numberFontSize,
      width: numberWidth,
      marginTop: numberMarginTop,
      marginLeft: numberMarginLeft,
      lineHeight: 0.8,
      textAlign: "center",
    },
    redNumber: {
      color: "#FF0000",
    },
    suitSmall: {
      width: suitSmallWidth,
      height: suitSmallHeight,
      marginLeft: suitSmallLeftMargin,
    },
    suitLarge: {
      width: suitLargeWidth,
      height: suitLargeHeight,
      marginTop: suitLargeTopMargin,
      marginLeft: suitLargeLeftMargin,
    },
    cardBackImage: {
      width: "100%",
      height: "100%",
    },
    animationScene: {
      maxHeight: cardHeightPx,
      minHeight: cardHeightPx,
      maxWidth: cardWidthPx,
      minWidth: cardWidthPx,
      perspective: "600px",
    },
    animationCard: {
      maxHeight: cardHeightPx,
      minHeight: cardHeightPx,
      maxWidth: cardWidthPx,
      minWidth: cardWidthPx,
      position: "relative",
      transition: "transform 0.5s",
      transformStyle: "preserve-3d",
    },
    isFlipped: {
      transform: "rotateY(180deg)",
    },
    cardBack: {
      transform: "rotateY(180deg)",
    },
  }));

  const classes = useStyles();

  const suitImage = suitToImageMap[suit];

  const redNumberClass =
    suit == CardSuit.Heart || suit == CardSuit.Diamond ? classes.redNumber : "";

  const isFlippedClass = faceDownState ? classes.isFlipped : "";

  return (
    <div className={`${classes.animationScene} ${className}`}>
      <div className={`${classes.animationCard} ${isFlippedClass}`}>
        <Card className={`${classes.card}`}>
          <Typography className={`${classes.number} ${redNumberClass}`}>
            <strong>{number}</strong>
          </Typography>
          <div>
            <img src={suitImage} className={classes.suitSmall} />
          </div>
          <img src={suitImage} className={classes.suitLarge} />
        </Card>
        <Card className={`${classes.card} ${classes.cardBack}`}>
          <img src={cardBack} className={classes.cardBackImage} />
        </Card>
      </div>
    </div>
  );
}
