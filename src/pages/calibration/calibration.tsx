import { CalibrationBoard } from "@/widgets/calibration/board/ui/board";
import classess from "./calibration.module.scss";

export const CalibrationPage: React.FC = () => {
  return (
    <div className={classess.container}>
      <p className={classess.wipTitle}>
        Страница на стадии разработки, но каким-то чудом работает. Пользуйтесь
        на свой страх и риск (Особенно на телефоне)
      </p>
      <CalibrationBoard />
    </div>
  );
};
