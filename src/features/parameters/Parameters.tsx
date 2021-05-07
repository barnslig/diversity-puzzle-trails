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
        title={<FormattedMessage id="parameterCard.user.title" />}
        description={<FormattedMessage id="parameterCard.user.description" />}
        params={userParams}
      />
      <ParameterCard
        title={<FormattedMessage id="parameterCard.global.title" />}
        description={<FormattedMessage id="parameterCard.global.description" />}
        params={globalParams}
      />
    </>
  );
};

export default Parameters;
