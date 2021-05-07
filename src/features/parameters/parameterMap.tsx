import * as React from "react";
import { FormattedMessage } from "react-intl";
import {
  DirectionsRun,
  Fastfood,
  FitnessCenter,
  Group,
} from "@material-ui/icons";
import Soap from "../../common/icons/Soap";

import { ParameterType } from "../../common/types/Parameter";

type ParameterMapping = {
  icon: React.ReactNode;
  label: React.ReactNode;
  format: (val: number) => React.ReactNode;
};

type ParameterMap = {
  [K in ParameterType]: ParameterMapping;
};

const parameterMap: ParameterMap = {
  movements: {
    icon: <DirectionsRun />,
    label: <FormattedMessage id="parameters.movements.title" />,
    format: (val) => Math.ceil(val),
  },
  energy: {
    icon: <FitnessCenter />,
    label: <FormattedMessage id="parameters.energy.title" />,
    format: (val) => Math.ceil(val),
  },
  food: {
    icon: <Fastfood />,
    label: <FormattedMessage id="parameters.food.title" />,
    format: (val) => Math.ceil(val),
  },
  hygiene: {
    icon: <Soap />,
    label: <FormattedMessage id="parameters.hygiene.title" />,
    format: (val) => Math.ceil(val),
  },
  moral: {
    icon: <Group />,
    label: <FormattedMessage id="parameters.moral.title" />,
    format: (val) => Math.ceil(val),
  },
};

export default parameterMap;
