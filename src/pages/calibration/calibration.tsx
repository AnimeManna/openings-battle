import { CalibrationBoard } from "@/widgets/calibration/board/ui/board";
import classess from "./calibration.module.scss";

export const CalibrationPage: React.FC = () => {
  return (
    <div className={classess.container}>
      <CalibrationBoard />
    </div>
  );
};
