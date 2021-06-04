import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import * as React from "react";

import { Code } from "../../common/types/Code";
import codeActionMap from "./codeActionMap";

type CodeProps = {
  code?: Code;
};

const Code = ({ code }: CodeProps) => {
  return (
    <List>
      {!code
        ? Array(3)
            .fill(0)
            .map((_, i) => (
              <ListItem key={i}>
                <ListItemIcon>
                  <Skeleton variant="circle" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton width={24} height={24} />}
                  secondary={<Skeleton width={140} height={20} />}
                />
              </ListItem>
            ))
        : code.attributes.actions.map((action, i) => {
            const { icon, value, label } = codeActionMap[action.type];
            return (
              <ListItem key={`${action.type}-${i}`}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={value(action)}
                  secondary={label(action)}
                />
              </ListItem>
            );
          })}
    </List>
  );
};

export default Code;