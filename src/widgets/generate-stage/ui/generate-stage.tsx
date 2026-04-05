import { useMemo, useState } from "react";
import classess from "./generate-stage.module.scss";
import type { StageFormat } from "@/entities/stage/model/types";
import { TextField } from "@/shared/ui/text-field/textfield";
import type { Option } from "@/shared/types/select";
import { Select } from "@/shared/ui/select/select";
import { Button } from "@/shared/ui/button/button";
import { useStageStore } from "@/entities/stage/model/store";
import { notifier } from "@/shared/lib/notifier";

type FormatOptions = Option & {
  value: StageFormat;
};

type Props = {
  onSubmit: () => void;
};

export const GenerateStageWidget: React.FC<Props> = ({ onSubmit }) => {
  const { generateSingleEliminationStage } = useStageStore();
  const [participantsPerRound, setParticipantsPerRound] = useState<
    number | string
  >(2);
  const [choicesPerRound, setChoicesPerRound] = useState<number | string>(1);
  const [format, setFormat] = useState<StageFormat>("single_elimination");
  const [name, setName] = useState<string>("");
  const [roundsPerDay, setRoundsPerDay] = useState<number | string>(1);

  const [additionalDays, setAdditionalDays] = useState<number | string>(0);

  const stagesMap = useStageStore((state) => state.stagesMap);
  const previousStage = useMemo(
    () => Array.from(stagesMap.values()).pop(),
    [stagesMap],
  );

  console.log(previousStage);

  const formatOptions: FormatOptions[] = [
    {
      label: "Один на один",
      value: "single_elimination",
    },
    {
      label: "Раунд-робин",
      value: "round_robin",
    },
  ];

  const isRoundRobin = useMemo(() => format === "round_robin", [format]);

  const submitSignelEliminationForm = async () => {
    const isFormValid = name.length > 0;
    const numRoundPerDay = Number(roundsPerDay);
    const numAdditionalDays = Number(additionalDays);
    if (
      !isFormValid ||
      Number.isNaN(numRoundPerDay) ||
      !numRoundPerDay ||
      !previousStage
    ) {
      notifier.error("Заполните имя");
      return;
    }

    if (Number.isNaN(numAdditionalDays)) {
      notifier.error("Заполните дни или поставьте 0");
      return;
    }
    try {
      await generateSingleEliminationStage(
        previousStage.id,
        name,
        numRoundPerDay,
        numAdditionalDays,
      );
      onSubmit();
    } catch (error) {
      notifier.error(JSON.stringify(error));
    }
  };

  const submitRoundRobinForm = async () => {
    onSubmit();
  };

  const submitForm = () => {
    if (isRoundRobin) {
      submitRoundRobinForm();
    } else {
      submitSignelEliminationForm();
    }
  };

  const previousStageRoundCount = useMemo(
    () =>
      previousStage
        ? previousStage.totalParticipants / previousStage.participantsPerRound
        : 0,
    [previousStage],
  );

  const roundPerDayOptions: Option[] = useMemo(
    () =>
      isRoundRobin
        ? []
        : Array.from({ length: previousStageRoundCount / 2 })
            .map((_, index) => ({
              label: `${index + 1}`,
              value: `${index + 1}`,
            }))
            .filter(
              (_, index) => (previousStageRoundCount / 2) % (index + 1) === 0,
            ),
    [isRoundRobin, previousStageRoundCount],
  );

  return (
    <div className={classess.container}>
      <TextField
        label="Название стейджа"
        placeholder="Отборочные, 1\32..."
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <Select
        label="Формат"
        placeholder="Один на один"
        options={formatOptions}
        value={format}
        onChange={(e) => setFormat(e.currentTarget.value as StageFormat)}
      />
      {isRoundRobin ? (
        <>
          <TextField
            label="Участников в раунде"
            placeholder="1,2,3..."
            value={participantsPerRound}
            onChange={(e) => setParticipantsPerRound(e.currentTarget.value)}
          />
          <TextField
            label="Количество выборов в раунде"
            placeholder="1,2,3..."
            value={choicesPerRound}
            onChange={(e) => setChoicesPerRound(e.currentTarget.value)}
          />
        </>
      ) : null}
      <Select
        label="Количество раундов в день"
        placeholder="1,2,3..."
        value={roundsPerDay}
        options={roundPerDayOptions}
        onChange={(e) => setRoundsPerDay(e.currentTarget.value)}
      />
      <TextField
        label="Дополнительно дней для голосования"
        placeholder="1,2,3..."
        value={additionalDays}
        onChange={(e) => setAdditionalDays(e.currentTarget.value)}
      />
      <Button onClick={submitForm}>Создать</Button>
    </div>
  );
};
