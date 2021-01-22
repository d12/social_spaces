import React, { useEffect, useRef, useState } from "react";
import { Cable } from "actioncable";

import { User } from "../../../ApplicationRoot";
import { GameState, DrawEvent, StrokeType, Event, ChatMessage } from "../../DrawIt";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import { ScoreBoard, PlayerScore, Timer } from "../../../Shared";

import { CSSTransition, SwitchTransition } from 'react-transition-group';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

import {
  garbageCan
} from "../../../../images";

export interface Props {
  user: User;
  subscription: Cable;
  gameState: GameState;
  events: React.MutableRefObject<Array<Event>>;
  messages: Array<ChatMessage>;
  wordForDrawer?: string;
}

const canvasWidth = 800;
const canvasHeight = 600;

const canvasOverlayAnimationLength = 1000;

const useStyles = makeStyles(
  () => ({
    statusCard: {
      width: "min(1450px, 90vw)",
      height: "60px",
      borderRadius: "10px",
      marginTop: "30px",
      marginBottom: "30px",
    },
    mainCard: {
      flex: 1,
      borderRadius: "10px",
      marginBottom: "40px",
      width: "min(1450px, 90vw)",
    },
    statusCardContent: {
      paddingTop: "0px",
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingBottom: "0px !important",
      height: "100%"
    },
    timerContainer: {
      border: "2px solid red",
      borderRadius: "8px",
      padding: "2px",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
    statusBarFlex: {
      height: "100%",
      marginLeft: "20px",
      paddingRight: "80px",
    },
    lettersContainer: {
      flex: 1,
    },
    letterUnfilled: {
      marginLeft: "4px",
      marginRight: "4px",
      borderBottom: "2px solid black",
      width: "30px",
      height: "35px",
    },
    letterFilled: {
      marginLeft: "4px",
      marginRight: "4px",
      width: "30px",
      height: "35px",
      paddingTop: "5px",
      textAlign: "center",
    },
    canvas: {
      border: "1px solid #C4C4C4",
      borderRadius: "5px",
      marginBottom: "8px",
      width: "min(50vw, 800px)",
      height: "100%",
    },
    canvasWrapper: {
      height: "min(100% - 50px - 4px, 800px)",
    },
    controls: {
      border: "1px solid #C4C4C4",
      borderRadius: "5px",
      padding: "1px",
      flexDirection: "row",
      width: "100%",
      flex: "0 1 auto",
      height: "50px",
      marginTop: "8px",
      paddingLeft: "4px",
    },
    chatBoxContainer: {
      width: "300px",
      height: "100%",
      marginLeft: "8px",
      border: "1px solid #C4C4C4",
      borderRadius: "5px",
      overflow: "hidden",
      flex: 1,
    },
    chatBoxMessagesContainer: {
      overflowY: "auto",
      flexWrap: "nowrap",
      backgroundColor: "#F6F6F4",
      flex: 1,
    },
    textFieldContainer: {
      height: "56px",
      backgroundColor: "#FFFFFF",
    },
    colorSelector: {
      margin: "5px",
      height: "30px",
      width: "30px",
      borderRadius: "50%",
    },
    colorsContainer: {
    },
    message: {
      margin: "5px",
      marginTop: "2px",
    },
    messageAuthor: {
      fontWeight: 800,
      fontSize: "18px",
      marginRight: "3px",
    },
    canvasTextContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      top: 0,
      position: "absolute",
      height: "min(100% - 2px, 800px)",
      width: "calc(100% - 2px)",
      paddingBottom: "10px",
      margin: "1px",
      borderRadius: "4px",
      border: "1px solid rgba(255, 255, 255, 0.95)",
    },
    canvasOverlayEnter: {
      opacity: 0,
    },
    canvasOverlayEnterActive: {
      transition: `opacity ${canvasOverlayAnimationLength}ms ease-in-out`,
      opacity: 1,
    },
    canvasOverlayExit: {
      opacity: 1,
    },
    canvasOverlayExitActive: {
      transition: `opacity ${canvasOverlayAnimationLength}ms ease-in-out`,
      opacity: 0,
    }
  })
);

const CustomTextField = withStyles({
  root: {
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
        borderColor: '#C4C4C4',
      },
      '&:hover fieldset': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
        borderColor: '#C4C4C4',
      },
      '&.Mui-focused fieldset': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
        borderWidth: "1px",
        borderColor: '#C4C4C4',
      },
    },
  },
})(TextField);

interface Coordinates {
  x: number;
  y: number;
}

interface PenState {
  isPenDown: boolean;
  previousCoords: Coordinates;
  currentCoords: Coordinates;
}

function draw(
  ctx: CanvasRenderingContext2D,
  from: Coordinates,
  to: Coordinates,
  width: number,
  color: string,
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

function erase(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Serialize for transport
function serializeDrawEvent(event: DrawEvent): Array<number> {
  return [
    event.strokeType,
    event.strokeColor,
    event.strokeWidth,
    event.x1,
    event.y1,
    event.x2,
    event.y2,
  ];
}

export default function Drawing({ user, subscription, gameState, events, messages, wordForDrawer }: Props) {
  const classes = useStyles(useTheme());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const selectedColorRef = useRef<number>(0);
  const textFieldRef = useRef<HTMLInputElement>();
  const [guess, setGuess] = useState<string>("");
  const [animStep, setAnimStep] = useState<number>(0);

  const previousGameState: GameState = usePrevious(gameState);

  const isDrawer = gameState.users[gameState.drawingUserIndex].id == user.id;
  const currentUser = gameState.users.find(u => u.id == user.id);

  // What index have we drawn up to
  const processIndexPtr = useRef<number>(0);

  // What index have we sent up to
  const sendIndexPtr = useRef<number>(0);

  let haveDrawn = false;

  const colors = [
    "#000000",
    "#615757",
    "#C82323",
    "#2F80ED",
    "#2D9CDB",
    "#56CCF2",
    "#F2994A",
    "#F2C94C",
    "#219653",
    "#27AE60",
    "#6FCF97",
    "#9B51E0",
  ]

  function sendMessageIfEnter(e: { keyCode: number; }) {
    if (e.keyCode === 13) {
      subscription.send({
        event: "guess",
        userId: user.id,
        userName: user.name,
        message: guess,
      });

      setGuess("");
    }
  }

  function getCanvasContext(): CanvasRenderingContext2D {
    return canvasRef.current.getContext("2d");
  }

  function addEvent(event: Event) {
    events.current = [...events.current, event];
    processDrawEvents();
  }

  const eventsToSend = useRef<Array<Event>>([]);

  function createEraseEvent() {
    const event: Event = { type: "erase" };

    addEvent(event);
    eventsToSend.current = [...eventsToSend.current, event];
  }

  function selectedWord(index: number): void {
    subscription.send({
      event: "select_word",
      userId: user.id,
      wordIndex: index,
    });
  }

  const penRef = useRef<PenState>({
    isPenDown: false,
    previousCoords: {
      x: 0,
      y: 0,
    },
    currentCoords: {
      x: 0,
      y: 0,
    },
  });

  // Drawing
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    function createDrawEvent(
      from: Coordinates,
      to: Coordinates,
    ) {
      const drawEvent: DrawEvent = {
        strokeType: StrokeType.PAINT,
        strokeColor: selectedColorRef.current,
        strokeWidth: 4,
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
      }

      const event: Event = { type: "draw", data: drawEvent };

      addEvent(event);
      eventsToSend.current = [...eventsToSend.current, event];
    }

    function mouseDown(e) {
      haveDrawn = true;

      const x = (e.clientX - canvas.offsetLeft) * (canvasWidth / canvas.offsetWidth);
      const y = (e.clientY - canvas.offsetTop) * (canvasHeight / canvas.offsetHeight);

      penRef.current = {
        previousCoords: { x, y },
        currentCoords: { x, y },
        isPenDown: true,
      };
    }

    function mouseMove(e) {
      const pen = penRef.current;
      const canvas = canvasRef.current;

      if (!pen.isPenDown) {
        return;
      }


      const x = (e.clientX - canvas.offsetLeft) * (canvasWidth / canvas.offsetWidth);
      const y = (e.clientY - canvas.offsetTop) * (canvasHeight / canvas.offsetHeight);

      penRef.current = {
        previousCoords: pen.currentCoords,
        currentCoords: { x, y },
        isPenDown: true,
      };

      const { previousCoords: from, currentCoords: to } = penRef.current;
      createDrawEvent(from, to);
    }

    function mouseUp() {
      const pen = penRef.current;
      if (!pen.isPenDown) {
        return;
      }
      const { previousCoords: from, currentCoords: to } = penRef.current;
      createDrawEvent(from, to);
      penRef.current.isPenDown = false;
    }

    function mouseOut() {
      const pen = penRef.current;
      if (!pen.isPenDown) {
        return;
      }
      const { previousCoords: from, currentCoords: to } = penRef.current;
      createDrawEvent(from, to);
      penRef.current.isPenDown = false;
    }

    if (isDrawer) {
      canvas.addEventListener("mousedown", mouseDown);
      canvas.addEventListener("mousemove", mouseMove);
      canvas.addEventListener("mouseup", mouseUp);
      canvas.addEventListener("mouseout", mouseOut);
    }

    return () => {
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("mouseout", mouseDown);
    }
  }, [canvasRef, isDrawer]);

  // Draw events
  function processDrawEvents() {
    events.current.slice(processIndexPtr.current, events.current.length).forEach((e: Event) => {
      switch (e.type) {
        case "draw":
          const drawEvent: DrawEvent = e.data;
          const from: Coordinates = { x: drawEvent.x1, y: drawEvent.y1 };
          const to: Coordinates = { x: drawEvent.x2, y: drawEvent.y2 };

          draw(getCanvasContext(), from, to, drawEvent.strokeWidth, colors[drawEvent.strokeColor]);
          break;

        case "erase":
          erase(getCanvasContext());
          break;
      }
    });

    processIndexPtr.current = events.current.length;
  }

  useEffect(() => {
    processDrawEvents();
  }, [events.current]);

  // Send events
  useEffect(() => {
    async function sendEvents() {
      if (!isDrawer)
        return;

      const len = eventsToSend.current.length;

      if (!haveDrawn) {
        sendIndexPtr.current = len;
        return;
      }

      if (len === sendIndexPtr.current)
        return;

      const selectedEvents: Array<Event> = eventsToSend.current.slice(sendIndexPtr.current, len);

      const drawEvents = selectedEvents.filter((e) => e.type === "draw");
      const eraseEvents = selectedEvents.filter((e) => e.type === "erase");

      if (drawEvents.length > 0) {
        subscription.send({
          event: "draw",
          userId: user.id,
          drawEvents: drawEvents.map((e) => serializeDrawEvent(e.data)),
        });
      }

      if (eraseEvents.length > 0) {
        subscription.send({
          event: "erase",
          userId: user.id,
        });
      }

      sendIndexPtr.current = len;
    }

    const sendEventsInterval = window.setInterval(sendEvents, 50);

    return () => {
      clearInterval(sendEventsInterval);
    }
  }, [eventsToSend, subscription, isDrawer]);

  // Rendering
  function controlsMarkup() {
    if (!isDrawer)
      return null;

    const colorsMarkup = colors.map((e, index) => {
      return <Box
        className={classes.colorSelector}
        style={{ backgroundColor: e, border: index == selectedColor ? "2px solid black" : "" }}
        key={"color-" + index}
        onClick={() => { setSelectedColor(index); selectedColorRef.current = index }}
      />
    });

    return (<Grid
      container
      className={classes.controls}
      alignItems="center"
    >
      <Grid container direction="row" className={classes.colorsContainer} >
        {colorsMarkup}
        <img onClick={createEraseEvent} className={classes.colorSelector} src={garbageCan}></img>
      </Grid>
    </Grid>);
  }

  const scores: PlayerScore[] = gameState.users.map((user) => {
    return {
      name: user.name,
      score: user.score,
    };
  });

  const messagesMarkup = messages.map((message, index) => {
    if (message.correct) {
      return (<Box className={classes.message} key={index}>
        <Typography display="inline" style={{ color: "#24C024" }}>{message.content}</Typography>
      </Box>);
    } else {
      return (<Box className={classes.message} key={index}>
        <Typography className={classes.messageAuthor} display="inline">{message.author}: </Typography>
        <Typography display="inline" style={{ color: "#444444" }}>{message.content}</Typography>
      </Box>);
    }
  });

  // Reveal / Pick a word / animations

  const selectAWordMarkupDrawer = isDrawer && gameState.status === "choosing" && <Grid
    container
    className={classes.canvasTextContainer}
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Typography variant="h3">Pick a word</Typography>
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      style={{ marginTop: "50px", paddingLeft: "25%", paddingRight: "25%" }}
    >
      <Button variant="outlined" color="secondary" onClick={() => selectedWord(0)}>{gameState.wordsToChoose[0]}</Button>
      <Button variant="outlined" color="secondary" onClick={() => selectedWord(1)}>{gameState.wordsToChoose[1]}</Button>
      <Button variant="outlined" color="secondary" onClick={() => selectedWord(2)}>{gameState.wordsToChoose[2]}</Button>
    </Grid>
  </Grid>;

  const selectAWordMarkupOther = !isDrawer && gameState.status === "choosing" && <Grid
    container
    className={classes.canvasTextContainer}
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Typography variant="h3">{gameState.users[gameState.drawingUserIndex].name} is choosing a word...</Typography>
  </Grid>;

  const revealText = gameState.status === "choosing" && gameState.givenLetters && <Grid
    container
    className={classes.canvasTextContainer}
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Typography variant="h3">The word was {gameState.givenLetters}!</Typography>
  </Grid>;

  const transitionStyles = {
    enter: classes.canvasOverlayEnter,
    enterActive: classes.canvasOverlayEnterActive,
    exit: classes.canvasOverlayExit,
    exitActive: classes.canvasOverlayExitActive,
  };

  function nextAnimStep() {
    if (animStep > 1)
      return;

    setAnimStep(animStep + 1);
  }

  // On choosing
  useEffect(() => {
    if (gameState.status !== "choosing") {
      setAnimStep(0);
      return;
    }

    if (previousGameState === undefined || previousGameState.status != "choosing") {
      if (revealText) {
        setAnimStep(1);
      } else {
        setAnimStep(2)
      }
    }
  }, [gameState]);

  // On choosing -> drawing
  useEffect(() => {
    if (gameState.status == "drawing" && previousGameState && previousGameState.status != "drawing") {
      erase(getCanvasContext());
    }
  });

  const canvasOverlayElement = (selectAWordMarkupDrawer || selectAWordMarkupOther) && <SwitchTransition>
    <CSSTransition
      timeout={canvasOverlayAnimationLength}
      classNames={transitionStyles}
      key={animStep}
      onEntered={() => setTimeout(nextAnimStep, 1000)}
    >
      {animStep === 0 ? <></> : (animStep === 1 ? revealText : (selectAWordMarkupDrawer || selectAWordMarkupOther))}
    </CSSTransition>
  </SwitchTransition>;

  const lettersMarkup = gameState.givenLetters && ((isDrawer && wordForDrawer) || gameState.givenLetters).split("").map((letter, index) => {
    if (letter === "_") {
      return <Box key={index} className={classes.letterUnfilled} />
    } else {
      return <Box key={index} className={classes.letterFilled}>
        <Typography variant="h3">{letter}</Typography>
      </Box>;
    }
  });

  const textboxText = isDrawer ? "You can't guess, you're drawing!"
    : (currentUser.hasGuessedCurrentWord ? "You got it! Waiting for others..."
      : "Type guesses here");

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ height: "100%", width: "auto" }}
      >
        <Card variant="outlined" className={classes.statusCard}>
          <CardContent className={classes.statusCardContent}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.statusBarFlex}
            >
              <Timer seconds={gameState.timeTilRoundEnd} />
              <Typography variant="h3" style={{ marginLeft: "25px" }}>Round {gameState.roundNumber} of 3</Typography>
              <Grid
                container
                className={classes.lettersContainer}
                justify="center"
              >
                {lettersMarkup}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined" className={classes.mainCard}>
          <CardContent style={{ height: "100%" }}>
            <Grid
              container
              direction="row"
              style={{ height: "100%", justifyContent: "space-between" }}
              wrap="nowrap"
            >
              <ScoreBoard scores={scores} selectedIndex={gameState.drawingUserIndex} />
              <Grid
                container
                direction="column"
                style={{ width: "auto", justifyContent: "space-between" }}
                wrap="nowrap"
              >
                <div className={classes.canvasWrapper} style={{ position: canvasOverlayElement ? "relative" : "static" }}>
                  <canvas
                    ref={canvasRef}
                    className={classes.canvas}
                    height={canvasHeight}
                    width={canvasWidth}
                  />
                  {canvasOverlayElement}
                </div>

                {controlsMarkup()}
              </Grid>
              <Grid
                container
                direction="column"
                className={classes.chatBoxContainer}
              >
                <Grid
                  container
                  direction="column"
                  justify="flex-end"
                  className={classes.chatBoxMessagesContainer}
                >
                  {messagesMarkup}
                </Grid>
                <Box className={classes.textFieldContainer}>
                  <CustomTextField
                    placeholder={textboxText}
                    variant="outlined"
                    autoComplete="off"
                    inputRef={textFieldRef}
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={sendMessageIfEnter}
                    fullWidth={true}
                    autoFocus
                    disabled={currentUser.hasGuessedCurrentWord || isDrawer}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

// TODO: Bring this into its own file
function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
