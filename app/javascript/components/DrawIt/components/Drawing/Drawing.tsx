import React, { useEffect, useRef, useState } from "react";
import { Cable } from "actioncable";

import { Group, User } from "../../../ApplicationRoot";
import { GameState, DrawEvent, StrokeType, Event, ChatMessage } from "../../DrawIt";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import { ScoreBoard, PlayerScore, Timer } from "../../../Shared";

import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { API } from "../../../modules/API";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tooltip,
} from "@material-ui/core";

import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  garbageCan
} from "../../../../images";

export interface Props {
  user: User;
  group: Group;
  subscription: Cable;
  gameState: GameState;
  events: React.MutableRefObject<Array<Event>>;
  messages: Array<ChatMessage>;
  wordForDrawer?: string;
}

const canvasWidth = 800;
const canvasHeight = 600;

const canvasOverlayAnimationLength = 1000;

const sendEventsIntervalTime = 150;

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
      width: "24px",
      height: "35px",
    },
    letterFilled: {
      marginLeft: "4px",
      marginRight: "4px",
      width: "24px",
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
      touchAction: "none",
    },
    canvasWrapper: {
      height: "min(100% - 50px - 4px, 800px)",
    },
    controls: {
      border: "1px solid #C4C4C4",
      borderRadius: "5px",
      padding: "1px",
      flexDirection: "row",
      width: "min(50vw, 800px)",
      flex: "0 1 auto",
      height: "50px",
      marginTop: "8px",
      paddingLeft: "4px",
      flexWrap: "nowrap",
      overflowX: "auto",
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
      width: "100%",
      flexWrap: "nowrap",
      justifyContent: "center",
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
    }, finalScore: {
      marginTop: "10px",
    }, finalScoreHeader: {
      marginBottom: "30px",
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

export default function Drawing({ user, group, subscription, gameState, events, messages, wordForDrawer }: Props) {
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

  function endActivity() {
    if (user.id == group.hostId)
      API.endActivity(group.key);
  }

  function sendMessageIfEnter(e: { keyCode: number; }) {
    if (e.keyCode === 13 && guess != "" && guess.length < 400) {
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
    if (gameState.status != "drawing") return;

    haveDrawn = true;
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
        x1: Math.floor(from.x),
        y1: Math.floor(from.y),
        x2: Math.floor(to.x),
        y2: Math.floor(to.y),
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
      canvas.addEventListener("pointerdown", mouseDown);
      canvas.addEventListener("pointermove", mouseMove);
      canvas.addEventListener("pointerup", mouseUp);
      canvas.addEventListener("pointerout", mouseOut);
    }

    return () => {
      canvas.removeEventListener("pointerdown", mouseDown);
      canvas.removeEventListener("pointermove", mouseMove);
      canvas.removeEventListener("pointerup", mouseUp);
      canvas.removeEventListener("pointerout", mouseDown);
    }
  }, [canvasRef, isDrawer]);

  // Draw events
  function processDrawEvents() {
    const EVENTS_TO_PROCESS = 2;

    let amountToProcess;
    const numberOfEventsInTheQueue = events.current.length - processIndexPtr.current;

    if (numberOfEventsInTheQueue == 0) {
      amountToProcess = 0;
    } else if (numberOfEventsInTheQueue < 15) {
      amountToProcess = 1;
    } else if (numberOfEventsInTheQueue < 30) {
      amountToProcess = 2;
    } else if (numberOfEventsInTheQueue < 45) {
      amountToProcess = 3;
    } else if (numberOfEventsInTheQueue < 60) {
      amountToProcess = 6;
    } else {
      amountToProcess = numberOfEventsInTheQueue;
    }

    events.current.slice(processIndexPtr.current, processIndexPtr.current + amountToProcess).forEach((e: Event) => {
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

    processIndexPtr.current = processIndexPtr.current + amountToProcess;
  }

  // This mysteriously stopped working, not sure why.
  // useEffect(() => {
  //   processDrawEvents();
  // }, [events.current]);

  useEffect(() => {
    const flushDrawEventsInterval = setInterval(processDrawEvents, 25);

    return () => clearInterval(flushDrawEventsInterval);
  }, [])

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

    const sendEventsInterval = window.setInterval(sendEvents, sendEventsIntervalTime);

    return () => {
      clearInterval(sendEventsInterval);
    }
  }, [eventsToSend, subscription, isDrawer]);

  // Rendering
  const smallControls = useMediaQuery('(max-width:1040px)');

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
      <Grid container direction="row" className={classes.colorsContainer} style={{ width: smallControls ? "auto" : "100%" }} >
        {colorsMarkup}
        <img onClick={createEraseEvent} className={classes.colorSelector} src={garbageCan}></img>
      </Grid>
    </Grid>);
  }

  const scores: PlayerScore[] = gameState.users.map((user) => {
    return {
      name: user.name,
      score: user.score,
      blobId: group.users.find((u) => u.id == user.id)?.blobId,
    };
  });

  const messagesMarkup = messages.map((message, index) => {
    switch (message.type) {
      case "correct":
        return (<Box className={classes.message} key={index}>
          <Typography display="inline" style={{ color: "#24D024" }}>{message.content}</Typography>
        </Box>);
      case "notice":
        return (<Box className={classes.message} key={index}>
          <Typography display="inline" style={{ color: "#FCBA03" }}>{message.content}</Typography>
        </Box>);
      case "ratelimit":
        return (<Box className={classes.message} key={index}>
          <Typography display="inline" style={{ color: "#DD2135" }}>{message.content}</Typography>
        </Box>);
      case "guess":
        return (<Box className={classes.message} key={index}>
          <Typography className={classes.messageAuthor} display="inline">{message.author}: </Typography>
          <Typography display="inline" style={{ color: "#444444" }}>{message.content}</Typography>
        </Box>);
      case "winnersmessage":
        return (<Box className={classes.message} key={index}>
          <Typography className={classes.messageAuthor} display="inline" style={{ color: "#94C094" }}>{message.author}: </Typography>
          <Typography display="inline" style={{ color: "#94C094" }}>{message.content}</Typography>
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
      justify="center"
      alignItems="center"
      style={{ marginTop: "50px" }}
    >
      <Button style={{ margin: "10px" }} variant="outlined" color="secondary" onClick={() => selectedWord(0)}>{gameState.wordsToChoose[0]}</Button>
      <Button style={{ margin: "10px" }} variant="outlined" color="secondary" onClick={() => selectedWord(1)}>{gameState.wordsToChoose[1]}</Button>
      <Button style={{ margin: "10px" }} variant="outlined" color="secondary" onClick={() => selectedWord(2)}>{gameState.wordsToChoose[2]}</Button>
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

  const outOfTimeText = gameState.ranOutOfTime ? "Out of time!" : "";

  const revealText = (gameState.status === "choosing" || gameState.status == "game_over") && gameState.givenLetters && <Grid
    container
    className={classes.canvasTextContainer}
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Typography variant="h3">{outOfTimeText} The word was {gameState.givenLetters}!</Typography>
  </Grid>;

  const transitionStyles = {
    enter: classes.canvasOverlayEnter,
    enterActive: classes.canvasOverlayEnterActive,
    exit: classes.canvasOverlayExit,
    exitActive: classes.canvasOverlayExitActive,
  };

  function colorForPlace(place: number): string {
    switch (place) {
      case 1:
        return "#FFD700";

      case 2:
        return "#B0B0B0";

      case 3:
        return "#CD7F32";

      default:
        return "#000000";
    }
  }

  function playAgain() {
    if (gameState.status != "game_over" || user.id !== group.hostId)
      return;

    subscription.send({
      event: "play_again"
    });
  }

  const gameOverMarkup = gameState.status === "game_over" && <Grid
    container
    className={classes.canvasTextContainer}
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Typography variant="h2" className={classes.finalScoreHeader}>
      Game over!
    </Typography>
    <Box>
      {[...gameState.users].sort((a, b) => (b.score - a.score)).map((u, index) => (
        <Box key={u.id} className={classes.finalScore}>
          <Typography variant="h3">
            <span style={{ color: colorForPlace(index + 1) }}>#{index + 1}</span> - {u.name}
          </Typography>
        </Box>
      ))}
    </Box>
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ marginTop: "50px" }}
    >
      <Tooltip
        title={user.id == group.hostId ? "" :
          <span style={{ fontSize: "14px" }}>
            Only the host can restart the game.
          </span>
        }
      >
        <span>
          <Button
            style={{ margin: "10px" }}
            variant="outlined"
            color="secondary"
            disabled={user.id !== group.hostId}
            onClick={playAgain}
          >
            Play again
          </Button>
        </span>
      </Tooltip>
      <Tooltip
        title={user.id == group.hostId ? "" :
          <span style={{ fontSize: "14px" }}>
            Only the host can end the activity for the group.
          </span>
        }
      >
        <span>
          <Button
            style={{ margin: "10px" }}
            variant="outlined"
            color="secondary"
            disabled={user.id !== group.hostId}
            onClick={endActivity}
          >
            End Activity
          </Button>
        </span>
      </Tooltip>
    </Grid>
  </Grid>;

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
      setGuess("");
      setAnimStep(0);
    }
  });

  // On drawing -> game_over
  useEffect(() => {
    if (gameState.status == "game_over") {
      if (animStep == 0) {
        setAnimStep(1); // Show the word reveal first
      } else {
        setAnimStep(2);
      }
    }
  }, [gameState]);

  const canvasOverlayElement = (selectAWordMarkupDrawer || selectAWordMarkupOther || gameOverMarkup) && <SwitchTransition>
    <CSSTransition
      timeout={canvasOverlayAnimationLength}
      classNames={transitionStyles}
      key={animStep}
      onEntered={() => setTimeout(nextAnimStep, 1200)}
    >
      {animStep === 0 ? <></> : (animStep === 1 ? revealText : (selectAWordMarkupDrawer || selectAWordMarkupOther || gameOverMarkup))}
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

  const textboxText = gameState.status != "drawing" ? "Type guesses here" : (
    isDrawer ? "Chat with people who've guessed." : (
      currentUser.hasGuessedCurrentWord ? "Chat with people who've guessed." : "Type guesses here"
    )
  );

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
              <Timer seconds={gameState.status == "drawing" ? gameState.timeTilRoundEnd : 0} />
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
