import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Cable } from "actioncable";

import { User } from "../../../ApplicationRoot";
import { GameState, DrawEvent, StrokeType, StrokeColor } from "../../DrawIt";

import * as styles from "./Drawing.module.scss";

import {
  Box,
  Grid,
} from "@material-ui/core";

export interface Props {
  user: User;
  subscription: Cable;
  gameState: GameState;
  drawEvents: React.MutableRefObject<Array<DrawEvent>>;
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

export default function Drawing({ user, subscription, gameState, drawEvents }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const selectedColorRef = useRef<number>(0);

  const isDrawer = gameState.users[gameState.drawingUserIndex].id == user.id;

  // What index have we drawn up to
  let drawIndexPtr: number = 0;

  // What index have we sent up to
  let sendIndexPtr: number = 0;

  let haveDrawn = false;

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
  ]

  function drawFromDrawEvents() {
    const len = drawEvents.current.length;

    if(len === drawIndexPtr)
      return;

    const canvasContext = canvasRef.current.getContext("2d");

    drawEvents.current.slice(drawIndexPtr, len).forEach((e: DrawEvent) => {
      const from: Coordinates = { x: e.x1, y: e.y1 };
      const to: Coordinates = { x: e.x2, y: e.y2 };
      draw(canvasContext, from, to, e.strokeWidth, colors[e.strokeColor]);
    });

    drawIndexPtr = len;
  }

  async function sendDrawEvents() {
    if(!isDrawer)
      return;

    const len: number = drawEvents.current.length;

    if(!haveDrawn){
      sendIndexPtr = len;
      return;
    }

    if(len === sendIndexPtr)
      return;

    const eventsToSend: Array<DrawEvent> = drawEvents.current.slice(sendIndexPtr, len);
    const serializedEvents: Array<Array<number>> = eventsToSend.map(e => serializeDrawEvent(e) );

    subscription.send({
      event: "draw",
      userId: user.id,
      drawEvents: serializedEvents,
    });

    sendIndexPtr = len;
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

  function createDrawEvent(
    from: Coordinates,
    to: Coordinates,
  ) {
    const event: DrawEvent = {
      strokeType: StrokeType.PAINT,
      strokeColor: selectedColorRef.current,
      strokeWidth: 4,
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
    }

    drawEvents.current = [...drawEvents.current, event];
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

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

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

  useEffect(() => {
    const drawInterval = window.setInterval(drawFromDrawEvents, 50);
    const sendEventsInterval = window.setInterval(sendDrawEvents, 50);

    return () => {
      clearInterval(drawInterval);
      clearInterval(sendEventsInterval);
    }
  }, []);

  const title: string = isDrawer ?
    "You're drawing!" :
    "You're not drawing :(";

  function controlsMarkup() {
    if(!isDrawer)
      return null

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
    </Grid>);
  }

  return (
    <div>
      <h2>{title}</h2>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        height="400"
        width="600"
      />

      {controlsMarkup()}
    </div>
  );
};
