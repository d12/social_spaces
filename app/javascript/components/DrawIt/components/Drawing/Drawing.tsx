import React, { useEffect, useRef } from "react";
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

export default function Drawing({ user, subscription, gameState }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      draw(canvas.getContext("2d"), from, to, 4);
    });

    // TODO: Refactor so mouseup and mouseout don't repeat each other
    canvas.addEventListener("mouseup", () => {
      const pen = penRef.current;
      if (!pen.isPenDown) {
        return;
      }
      const { previousCoords: from, currentCoords: to } = penRef.current;
      draw(canvas.getContext("2d"), from, to, 4);
      penRef.current.isPenDown = false;
    });

    canvas.addEventListener("mouseout", (e) => {
      const pen = penRef.current;
      if (!pen.isPenDown) {
        return;
      }
      const { previousCoords: from, currentCoords: to } = penRef.current;
      draw(canvas.getContext("2d"), from, to, 4);
      penRef.current.isPenDown = false;
    });
  }, [canvasRef]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        height="400"
        width="600"
      />
    </div>
  );
}
