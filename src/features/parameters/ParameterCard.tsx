import * as React from "react";

import GameParameter from "../../common/components/GameParameter";
import GameParameterCard from "../../common/components/GameParameterCard";

import { Parameter } from "../../common/types/Parameter";
import parameterMap from "./parameterMap";

type ParameterCardType = {
  title: React.ReactNode;
  description: React.ReactNode;
  params: Parameter[];
};

const ParameterCard = ({ title, description, params }: ParameterCardType) => (
  <GameParameterCard title={title} description={description}>
    {params.map((param) => {
      const { icon, label, format } = parameterMap[param.parameter];
      return (
        <GameParameter
          key={param.parameter}
          icon={icon}
          label={label}
          value={format(param.value)}
        />
      );
    })}
  </GameParameterCard>
);

export default ParameterCard;
