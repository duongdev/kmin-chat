import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import qs from "querystring";
import io from "socket.io-client";
import { Box, Paper, Typography, useTheme, TextField } from "@material-ui/core";

const Room = () => {
  const roomId = useParams().roomId;
  const location = useLocation();
  const displayName = useMemo(
    () => qs.parse(location.search.replace(/^\?/, "")).displayName,
    [location.search]
  );
  const socketRef = useRef();
  const [messageValue, setMessageValue] = useState("");
  const [messages, setMessages] = useState([]);
  const theme = useTheme();

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode !== 13) {
        return;
      }

      const socket = socketRef.current;

      if (socket && socket.connected) {
        socket.emit("send-message", {
          displayName,
          message: messageValue,
          roomId,
        });
        setMessageValue("");
      }
    },
    [messageValue, displayName, roomId]
  );

  useEffect(() => {
    const socket = io.connect("http://localhost:4000");
    socketRef.current = socket;
    socket.emit("join", { displayName, roomId });

    socket.on("new-user-joined", ({ displayName, createdAt }) => {
      const msg = {
        content: `${displayName} joined`,
        createdAt,
      };
      setMessages((messages) => [...messages, msg]);
    });

    socket.on("new-message", ({ displayName, message, createdAt }) => {
      const msg = {
        content: message,
        createdAt,
        displayName,
      };
      setMessages((messages) => [...messages, msg]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        component={Paper}
        minWidth={400}
        maxWidth="90vw"
        height={400}
        maxHeight="90vh"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Box padding={3} bgcolor={theme.palette.primary.main} color="white">
          <Typography variant="h6" color="inherit">
            Room: {roomId}
          </Typography>
        </Box>
        <Box flexGrow={1} py={1}>
          {messages.map((message) => (
            <Box
              px={1}
              key={message.createdAt}
              style={{
                color: message.displayName
                  ? "inherit"
                  : theme.palette.text.secondary,
              }}
            >
              {message.displayName ? (
                <strong>{message.displayName}: </strong>
              ) : (
                ""
              )}
              {message.content}
            </Box>
          ))}
        </Box>
        <Box padding={2} bgcolor="rgba(0, 0, 0, 0.05)">
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Room;
