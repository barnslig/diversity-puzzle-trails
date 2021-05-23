import { FormattedMessage } from "react-intl";
import * as React from "react";

import { useAppSelector } from "../../app/hooks";

import ParameterCard from "./ParameterCard";

const Parameters = () => {
  const userParams = useAppSelector((state) => state.parameters.user);
  const globalParams = useAppSelector((state) => state.parameters.global);

  return (
    <>
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
      />
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
      />
    </>
  );
};

export default Parameters;
