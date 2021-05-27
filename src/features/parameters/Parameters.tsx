import { FormattedMessage } from "react-intl";
import * as React from "react";

import ParameterCard from "./ParameterCard";
import {
  useGlobalParameters,
  useUserParameters,
} from "../../common/hooks/api/useParameters";

const Parameters = () => {
  const userParams = useUserParameters();
  const globalParams = useGlobalParameters();

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
        numSkeletonParams={1}
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
        numSkeletonParams={4}
      />
    </>
  );
};

export default Parameters;
