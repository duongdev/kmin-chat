import React, { useState, useCallback } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const RoomEntry = () => {
  const history = useHistory();
  const [roomId, setRoomId] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleEnterRoom = useCallback(() => {
    if (roomId && displayName) {
      history.push(`/room/${roomId}?displayName=${displayName}`);
    }
  }, [roomId, displayName, history]);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box component={Paper} padding={8}>
        <Grid container spacing={2} direction="column" wrap="nowrap">
          <Grid item>
            <Typography variant="h4" align="center">
              Enter a room
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Room ID"
              fullWidth
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Your display name"
              fullWidth
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleEnterRoom}
            >
              Go!
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RoomEntry;
