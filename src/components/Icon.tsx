import * as React from "react";
import { IconName } from "../types";
import { ReactComponent as ActivityIcon } from "../icons/Activity.svg";
import { ReactComponent as ArrowIcon } from "../icons/Arrow.svg";
import { ReactComponent as AudioIcon } from "../icons/Audio.svg";
import { ReactComponent as CalendarIcon } from "../icons/Calendar.svg";
import { ReactComponent as CheckmarkIcon } from "../icons/Checkmark.svg";
import { ReactComponent as DragIcon } from "../icons/Drag.svg";
import { ReactComponent as DumbbellIcon } from "../icons/Dumbbell.svg";
import { ReactComponent as MinusIcon } from "../icons/Minus.svg";
import { ReactComponent as MuteIcon } from "../icons/Mute.svg";
import { ReactComponent as PauseIcon } from "../icons/Pause.svg";
import { ReactComponent as PencilIcon } from "../icons/Pencil.svg";
import { ReactComponent as PlayIcon } from "../icons/Play.svg";
import { ReactComponent as PlusIcon } from "../icons/Plus.svg";
import { ReactComponent as RestartIcon } from "../icons/Restart.svg";
import { ReactComponent as RunIcon } from "../icons/Run.svg";
import { ReactComponent as XIcon } from "../icons/X.svg";

type Props = {
  icon: IconName;
  className?: string;
};

const Icon: React.FC<Props> = ({ icon, className }) => {
  const IconComponent = {
    activity: ActivityIcon,
    arrow: ArrowIcon,
    audio: AudioIcon,
    calendar: CalendarIcon,
    checkmark: CheckmarkIcon,
    drag: DragIcon,
    dumbbell: DumbbellIcon,
    minus: MinusIcon,
    mute: MuteIcon,
    pause: PauseIcon,
    pencil: PencilIcon,
    play: PlayIcon,
    plus: PlusIcon,
    restart: RestartIcon,
    run: RunIcon,
    x: XIcon,
  }[icon];
  return <IconComponent className={className} />;
};

export default Icon;
