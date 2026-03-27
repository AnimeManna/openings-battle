import { useRoundsStore } from "@/entities/rounds/model/store";
import { RoundOpeningCard } from "@/widgets/round-opening-card/ui/round-opening-card";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

export const RoundPage: React.FC = () => {
  const params = useParams<{ roundId: string }>();
  //   const navigate = useNavigate();

  const { roundsMap } = useRoundsStore();

  const round = useMemo(
    () => (params.roundId ? (roundsMap.get(params.roundId) ?? null) : null),
    [params, roundsMap],
  );

  return (
    <section>
      {round && (
        <ul>
          {round.openingIds.map((openingId) => (
            <li key={openingId}>
              <RoundOpeningCard roundId={round.id} openingId={openingId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
