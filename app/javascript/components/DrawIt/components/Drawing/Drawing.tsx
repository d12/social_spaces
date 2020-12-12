import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Cable } from "actioncable";

import { User } from "../../../ApplicationRoot";
import { GameState, DrawEvent, StrokeType, StrokeColor, Event } from "../../DrawIt";

import * as styles from "./Drawing.module.scss";

import {
  Box,
  Grid,
} from "@material-ui/core";

export interface Props {
  user: User;
  subscription: Cable;
  gameState: GameState;
  events: Array<Event>;
  setEvents: React.Dispatch<React.SetStateAction<Array<Event>>>;
}

interface Coordinates {
  x: number;
  y: number;
}

interface PenState {
  isPenDown: boolean;
  previousCoords: Coordinates;
  currentCoords: Coordinates;
}

const canvasWidth = 600;
const canvasHeight = 400;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const selectedColorRef = useRef<number>(0);

  const isDrawer = gameState.users[gameState.drawingUserIndex].id == user.id;

  // What index have we drawn up to
  const processIndexPtr = useRef<number>(0);

  // What index have we sent up to
  const sendIndexPtr = useRef<number>(0);

  let haveDrawn = false;

  const colors = [
    "#000000",
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#0000FF",
    "#FF8000",

  ]

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

      canvas.addEventListener("mouseout", (e) => {
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

  const title: string = isDrawer ?
    "You're drawing!" :
    "You're not drawing :(";

  function controlsMarkup() {
    if(!isDrawer)
      return null;

    const colorsMarkup = colors.map((e, index) => {
      return <Box
        className={styles.colorSelector}
        style={{ backgroundColor: e, border: index == selectedColor ? "2px solid black" : "" }}
        key={"color-" + index}
        onClick={() => { setSelectedColor(index); selectedColorRef.current = index }}
        />
    });

    return (<Grid
      container
      className={styles.controls}
    >
      {colorsMarkup}
      <button onClick={createEraseEvent}>Erase</button>
    </Grid>);
  }

  return (
    <div>
      <h2>{title}</h2>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        height={canvasHeight}
        width={canvasWidth}
      />

      {controlsMarkup()}

    </div>
  );
};
