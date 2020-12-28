import React, { useEffect, useRef, useState } from "react";
import { Cable } from "actioncable";

import { User } from "../../../ApplicationRoot";
import { GameState, DrawEvent, StrokeType, StrokeColor, Event } from "../../DrawIt";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import { ScoreBoard, PlayerScore } from "../../../Shared";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@material-ui/core";

export interface Props {
  user: User;
  subscription: Cable;
  gameState: GameState;
  events: Array<Event>;
  setEvents: React.Dispatch<React.SetStateAction<Array<Event>>>;
}

const canvasWidth = 600;
const canvasHeight = 600;

const useStyles = makeStyles(
  () => ({
    statusCard: {
      width: "100%",
      height: "60px",
      borderRadius: "10px",
      marginTop: "30px",
      marginBottom: "30px",
    },
    mainCard: {
      flex: 1,
      borderRadius: "10px",
      marginBottom: "40px",
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
      height: canvasHeight,
      width: canvasWidth,
    },
    controls: {
      border: "1px solid #C4C4C4",
      borderRadius: "5px",
      padding: "1px",
      flexDirection: "row",
      width: canvasWidth,
      flex: 1,
    },
    chatBoxContainer: {
      width: "300px",
      height: "100%",
      marginLeft: "8px",
      border: "1px solid #C4C4C4",
      borderRadius: "5px",
      overflow: "hidden",
    },
    chatBoxMessagesContainer: {
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
      width: canvasWidth / 3,
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
        borderColor: '#C4C4C4',
      },
      '&:hover fieldset': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderColor: '#C4C4C4',
      },
      '&.Mui-focused fieldset': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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

export default function Drawing({ user, subscription, gameState, events, setEvents }: Props) {
  const classes = useStyles(useTheme());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const selectedColorRef = useRef<number>(0);
  const textFieldRef = useRef<HTMLInputElement>();
  const [guess, setGuess] = useState<string>("");

  const isDrawer = gameState.users[gameState.drawingUserIndex].id == user.id;

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
    "#BB6BD9",
  ]

  function submitIfEnter(e: { keyCode: number; }) {
    if (e.keyCode === 13) {
      console.log(guess);
    }
  }

  function getCanvasContext(): CanvasRenderingContext2D {
    return canvasRef.current.getContext("2d");
  }

  function addEvent(event: Event){
    setEvents(e => [...e, event]);
  }

  const eventsToSend = useRef<Array<Event>>([]);

  function createEraseEvent() {
    const event: Event = { type: "erase" };

    addEvent(event);
    eventsToSend.current = [...eventsToSend.current, event];
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

    if(isDrawer){
      canvas.addEventListener("mousedown", (e) => {
        haveDrawn = true;

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        penRef.current = {
          previousCoords: { x, y },
          currentCoords: { x, y },
          isPenDown: true,
        };
      });

      canvas.addEventListener("mousemove", (e) => {
        const pen = penRef.current;
        const canvas = canvasRef.current;

        if (!pen.isPenDown) {
          return;
        }

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        penRef.current = {
          previousCoords: pen.currentCoords,
          currentCoords: { x, y },
          isPenDown: true,
        };

        const { previousCoords: from, currentCoords: to } = penRef.current;
        createDrawEvent(from, to);
      });

      // TODO: Refactor so mouseup and mouseout don't repeat each other
      canvas.addEventListener("mouseup", () => {
        const pen = penRef.current;
        if (!pen.isPenDown) {
          return;
        }
        const { previousCoords: from, currentCoords: to } = penRef.current;
        createDrawEvent(from, to);
        penRef.current.isPenDown = false;
      });

      canvas.addEventListener("mouseout", () => {
        const pen = penRef.current;
        if (!pen.isPenDown) {
          return;
        }
        const { previousCoords: from, currentCoords: to } = penRef.current;
        createDrawEvent(from, to);
        penRef.current.isPenDown = false;
      });
    }
  }, [canvasRef]);

  // Draw events
  useEffect(() => {
    events.slice(processIndexPtr.current, events.length).forEach((e: Event) => {
      switch(e.type) {
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

    processIndexPtr.current = events.length;
  }, [events]);

  // Send events
  useEffect(() => {
    async function sendEvents() {
      if(!isDrawer)
        return;

      const len = eventsToSend.current.length;

      if(!haveDrawn){
        sendIndexPtr.current = len;
        return;
      }

      if(len === sendIndexPtr.current)
        return;

      const selectedEvents: Array<Event> = eventsToSend.current.slice(sendIndexPtr.current, len);

      const drawEvents = selectedEvents.filter((e) => e.type === "draw");
      const eraseEvents = selectedEvents.filter((e) => e.type === "erase");

      if(drawEvents.length > 0) {
        subscription.send({
          event: "draw",
          userId: user.id,
          drawEvents: drawEvents.map((e) => serializeDrawEvent(e.data)),
        });
      }

      if(eraseEvents.length > 0) {
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
  }, [eventsToSend, subscription]);

  // Rendering

  function controlsMarkup() {
    if(!isDrawer)
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
    >
      <Grid container direction="row" className={classes.colorsContainer} >
        {colorsMarkup}
      </Grid>
      <button onClick={createEraseEvent}>Erase</button>
    </Grid>);
  }

  const scores: PlayerScore[] = [
    {
      name: "Nathaniel",
      score: 2,
    },
    {
      name: "Lulu",
      score: 5,
    },
    {
      name: "Angie",
      score: 9,
    },
    {
      name: "Fergie",
      score: 1,
    },
    {
      name: "Sabera",
      score: 0,
    },
    {
      name: "Andrei",
      score: 0,
    },
  ];

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
              <Box className={classes.timerContainer}>
                <Typography variant="h3">1:01</Typography>
              </Box>
              <Typography variant="h3" style={{ marginLeft: "25px" }}>Round 1 of 3</Typography>
              <Grid
                container
                className={classes.lettersContainer}
                justify="center"
              >
                <Box className={classes.letterFilled}>
                  <Typography variant="h3">P</Typography>
                </Box>
                <Box className={classes.letterFilled}>
                  <Typography variant="h3">E</Typography>
                </Box>
                <Box className={classes.letterUnfilled}>
                </Box>
                <Box className={classes.letterFilled}>
                  <Typography variant="h3">I</Typography>
                </Box>
                <Box className={classes.letterFilled}>
                  <Typography variant="h3">S</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined" className={classes.mainCard}>
          <CardContent style={{ height: "100%" }}>
            <Grid
              container
              direction="row"
              style={{ height: "100%" }}
              wrap="nowrap"
            >
              <ScoreBoard scores={scores} selectedIndex={0} />
              <Grid
                container
                direction="column"
                style={{ width: "auto" }}
                wrap="nowrap"
              >
                <canvas
                  ref={canvasRef}
                  className={classes.canvas}
                  height={canvasHeight}
                  width={canvasWidth}
                />

                {controlsMarkup()}
              </Grid>
              <Grid
                container
                direction="column"
                className={classes.chatBoxContainer}
              >
                <Box className={classes.chatBoxMessagesContainer}>
                  Hello
                </Box>
                <Box className={classes.textFieldContainer}>
                <CustomTextField
                  placeholder="Type guesses here"
                  variant="outlined"
                  autoComplete="off"
                  inputRef={textFieldRef}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={submitIfEnter}
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
