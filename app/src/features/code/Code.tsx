import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Skeleton } from "@mui/material";
import * as React from "react";

import { Code as CodeType } from "../../common/types/Code";
import codeActionMap from "./codeActionMap";

type CodeProps = {
  code?: CodeType;
};

const Code = ({ code }: CodeProps) => {
  return (
    <List>
      {!code ? (
        <ListItem>
          <ListItemIcon>
            <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton width={24} height={24} />}
            secondary={<Skeleton width={140} height={20} />}
          />
        </ListItem>
      ) : (
        code.attributes.actions.map((action, i) => {
          const { icon, value, label } = codeActionMap[action.type];
          return (
            <ListItem key={`${action.type}-${i}`}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={value(action)} secondary={label(action)} />
            </ListItem>
          );
        })
      )}
    </List>
  );
};

export default Code;
