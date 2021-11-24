import { Skeleton } from "@mui/material";
import * as React from "react";

import GameParameter from "../../common/components/GameParameter";
import GameParameterCard from "../../common/components/GameParameterCard";

import { Parameter } from "../../common/types/Parameter";
import parameterMap from "./parameterMap";

type ParameterCardType = {
  title: React.ReactNode;
  description: React.ReactNode;
  params: Parameter[];
  numSkeletonParams: number;
};

const ParameterCard = ({
  title,
  description,
  params,
  numSkeletonParams,
}: ParameterCardType) => (
  <GameParameterCard title={title} description={description}>
    {params.length === 0
      ? Array(numSkeletonParams)
          .fill(0)
          .map((_, i) => (
            <GameParameter
              key={i}
              icon={<Skeleton variant="circular" width={24} height={24} />}
              label={<Skeleton width={140} height={20} />}
              value={<Skeleton width={24} height={24} />}
            />
          ))
      : params.map((param) => {
          const { icon, label, format } = parameterMap[param.id];
          return (
            <GameParameter
              key={param.id}
              icon={icon}
              label={label}
              value={format(param.attributes.value)}
            />
          );
        })}
  </GameParameterCard>
);

export default ParameterCard;
