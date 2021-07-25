import { FormattedMessage } from "react-intl";
import * as React from "react";

import {
  useParameters,
  useScopedParameterResponse,
} from "../../common/hooks/api/useParameters";
import ParameterCard from "./ParameterCard";
import useGame from "../../common/hooks/api/useGame";

const Parameters = () => {
  const game = useGame();

  const { data } = useParameters();
  const userParams = useScopedParameterResponse("user", data);
  const globalParams = useScopedParameterResponse("global", data);

  return (
    <>
      {game.data?.data.attributes.hasUserParameterScope && (
        <ParameterCard
          title={
            <FormattedMessage
              defaultMessage="Persönliches"
              description="personal parameter card title"
            />
          }
          description={
            <FormattedMessage
              defaultMessage="Diese Parameter betreffen nur dich selber. Tausche sie gegen Aktionskarten ein!"
              description="personal parameter card description"
            />
          }
          params={userParams}
          numSkeletonParams={1}
        />
      )}
      <ParameterCard
        title={
          <FormattedMessage
            defaultMessage="Spielstand"
            description="global parameter card title"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Der Status eurer gemeinsamen Mission. Achtet darauf, dass kein Wert 0 erreicht!"
            description="global parameter card description"
          />
        }
        params={globalParams}
        numSkeletonParams={4}
      />
    </>
  );
};

export default Parameters;
