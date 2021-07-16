import { Card, CardContent, Typography } from "@mui/material";
import { FormattedRelativeTime } from "react-intl";
import * as React from "react";

import { Message } from "../types/Message";

type MessageCardProps = {
  message: Message;
};

const MessageCard = ({ message }: MessageCardProps) => {
  return (
    <Card
      sx={{
        position: "relative",
        marginBottom: 2,
      }}
      key={message.id}
    >
      <CardContent>
        <Typography variant="body2">{message.attributes.message}</Typography>
        <Typography
          color="textSecondary"
          sx={{
            position: "absolute",
            bottom: 3,
            right: (theme) => theme.spacing(1),
          }}
          variant="caption"
        >
          <FormattedRelativeTime
            value={
              (new Date(message.attributes.createdAt).getTime() -
                new Date().getTime()) /
              1000
            }
            updateIntervalInSeconds={30}
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
