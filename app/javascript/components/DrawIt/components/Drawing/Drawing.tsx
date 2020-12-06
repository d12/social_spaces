import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Cable } from "actioncable";

import { User } from "../../../ApplicationRoot";
import { GameState } from "../../DrawIt";

import * as styles from "./Drawing.module.scss";

export interface Props {
  user: User;
  subscription: Cable;
  gameState: GameState;
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

enum StrokeType {
  PAINT = 0,
  ERASE = 1,
  FILL = 2,
}

enum StrokeColor {
  BLACK = 0,
}

interface DrawEvent {
  strokeType: StrokeType;
  strokeColor: StrokeColor;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function draw(
  ctx: CanvasRenderingContext2D,
  from: Coordinates,
  to: Coordinates,
  width: number
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

const Drawing = forwardRef(({ user, subscription, gameState }: Props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawer = gameState.users[gameState.drawingUserIndex].id == user.id;

  // TODO: drawEvents will get pretty big. Make sure we empty it occasionally, maybe at the end of each round?
  let drawEvents: Array<DrawEvent> = [];

  // What index have we sent up to
  let sendIndexPtr: number = 0;

  async function drawFromDrawEvents(events: Array<DrawEvent>) {
    if(events.length === 0)
      return;

    const canvasContext = canvasRef.current.getContext("2d");

    events.forEach((e: DrawEvent) => {
      const from: Coordinates = { x: e.x1, y: e.y1 };
      const to: Coordinates = { x: e.x2, y: e.y2 };
      draw(canvasContext, from, to, e.strokeWidth);
    });
  }

  async function sendDrawEvents() {
    if(!isDrawer)
      return;

    const len: number = drawEvents.length;

    if(len === sendIndexPtr)
      return;

    const eventsToSend: Array<DrawEvent> = drawEvents.slice(sendIndexPtr, len);
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

  function deserializeDrawEvent(input: Array<number>) : DrawEvent {
    return {
      strokeType: input[0],
      strokeColor: input[1],
      strokeWidth: input[2],
      x1: input[3],
      y1: input[4],
      x2: input[5],
      y2: input[6],
    };
  }

  useImperativeHandle(ref, () => ({
    receiveDrawEvents(newDrawEvents: Array<Array<number>>) {
      const deserializedEvents: Array<DrawEvent> = newDrawEvents.map(e => deserializeDrawEvent(e));
      drawFromDrawEvents(deserializedEvents);
    }
  }));

  function createDrawEvent(
    from: Coordinates,
    to: Coordinates,
  ) {
    const event: DrawEvent = {
      strokeType: StrokeType.PAINT,
      strokeColor: StrokeColor.BLACK,
      strokeWidth: 4,
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
    }

    drawEvents = [...drawEvents, event];
    drawFromDrawEvents([event]);
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
    const sendEventsInterval = window.setInterval(sendDrawEvents, 50);

    return () => {
      clearInterval(sendEventsInterval);
    }
  }, []);

  const title: string = isDrawer ?
    "You're drawing!" :
    "You're not drawing :(";

  return (
    <div>
      <h2>{title}</h2>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        height="400"
        width="600"
      />
    </div>
  );
});

export default Drawing;
