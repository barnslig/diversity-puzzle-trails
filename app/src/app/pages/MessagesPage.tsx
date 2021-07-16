import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  LinearProgress,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import * as React from "react";

import MainNav from "../MainNav";
import MessageCard from "../../common/components/MessageCard";
import useMessages from "../../common/hooks/api/useMessages";
import { Message } from "../../common/types/Message";
import HeroMessage from "../../common/components/HeroMessage";

const MessagesPage = () => {
  const { data: messages } = useMessages();

  // Scroll to the bottom after (new) messages are rendered
  React.useEffect(() => {
    const $html = document.documentElement;
    $html.scrollTop = $html.scrollHeight;
  }, [messages]);

  /**
   * Whether the API has returned zero messages
   */
  const hasNoMessages = messages && messages.data.length === 0;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
            <FormattedMessage
              defaultMessage="Nachrichten"
              description="messages page title"
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <MainNav />
      <Box
        component="main"
        paddingBottom={7}
        paddingTop={10}
        sx={{ display: "flex", alignItems: "flex-end", minHeight: "100vh" }}
      >
        {hasNoMessages ? (
          <HeroMessage
            title={
              <FormattedMessage
                defaultMessage="Es gibt noch keine Nachrichten"
                description="messages page no messages yet title"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="Schau doch später nochmal vorbei."
                description="messages page no messages yet description"
              />
            }
          />
        ) : messages ? (
          <Container maxWidth="sm">
            {messages.data.map((msg: Message) => (
              <MessageCard key={msg.id} message={msg} />
            ))}
          </Container>
        ) : (
          <LinearProgress sx={{ width: "100%" }} />
        )}
      </Box>
    </div>
  );
};

export default MessagesPage;
