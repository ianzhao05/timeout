import { useRef, useState, useMemo, useEffect } from "react";
import * as React from "react";
import { useElapsedTime } from "use-elapsed-time";
import useSize from "@react-hook/size";
import { COLORS, minSecToString, secToMinSec } from "../../utils";
import SmallButton from "./SmallButton";
import styles from "./Timer.module.css";
import { ExerciseColor } from "../../types";

const getPathProps = (
  size: number,
  strokeWidth: number,
  rotation: "clockwise" | "counterclockwise"
) => {
  if (size <= 0) {
    size = strokeWidth;
  }
  const halfSize = size / 2;
  const halfStrokeWith = strokeWidth / 2;
  const arcRadius = halfSize - halfStrokeWith;
  const arcDiameter = 2 * arcRadius;
  const rotationIndicator = rotation === "clockwise" ? "1,0" : "0,1";

  const pathLength = 2 * Math.PI * arcRadius;
  const path = `m ${halfSize},${halfStrokeWith}
          a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,${arcDiameter}
          a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,-${arcDiameter}`;

  return { path, pathLength };
};

const linearEase = (
  time: number,
  start: number,
  goal: number,
  duration: number
) => {
  if (duration === 0) {
    return goal;
  }

  const currentTime = time / duration;
  return start + goal * currentTime;
};

const STROKE_WIDTH = 24;

type Props = {
  duration: number;
  color: ExerciseColor | "dark";
  onComplete?: (completed: number) => void;
};

const Timer: React.FC<Props> = ({
  duration: initDuration,
  color,
  onComplete,
}) => {
  const [duration] = useState(initDuration);
  const [playing, setPlaying] = useState(true);

  const containerRef = useRef(null);
  const [width] = useSize(containerRef);

  const { elapsedTime } = useElapsedTime(playing, {
    duration: duration || undefined,
    // onComplete: () => ({ shouldRepeat: true }),
  });

  const { path, pathLength } = useMemo(
    () =>
      getPathProps(
        width,
        STROKE_WIDTH,
        duration ? "clockwise" : "counterclockwise"
      ),
    [duration, width]
  );

  const elapsedSecs = useRef<number>(0);
  useEffect(() => {
    elapsedSecs.current = Math.ceil(elapsedTime);
  }, [elapsedTime]);
  useEffect(
    () => () => {
      onComplete?.(elapsedSecs.current);
    },
    [onComplete]
  );
  const remainingTime = secToMinSec(
    Math.ceil(duration ? duration - elapsedTime : elapsedTime)
  );

  return (
    <div className={styles.outerContainer}>
      <div ref={containerRef} className={styles.container}>
        <svg width={width} height={width} xmlns="http://www.w3.org/2000/svg">
          <path
            d={path}
            fill="none"
            stroke={COLORS[`${color}-light`]}
            strokeWidth={STROKE_WIDTH}
          />
          <path
            d={path}
            fill="none"
            stroke={COLORS[color]}
            strokeLinecap="round"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={pathLength}
            strokeDashoffset={linearEase(
              duration ? elapsedTime : 60 - (elapsedTime % 60),
              0,
              pathLength,
              duration || 60
            )}
          />
        </svg>
        <div className={styles.middle}>
          <p className={styles.time}>
            {minSecToString(remainingTime, "short")}
          </p>
          <SmallButton
            icon={playing ? "pause" : "play"}
            color={color}
            larger
            onClick={() => setPlaying(!playing)}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
