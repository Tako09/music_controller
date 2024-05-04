import React, { Component, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import {
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material"

export default function RoomJoinPage() {

  const [room, setRoom] = useState({
    roomCode: "",
    errorMsg: "",
    isError: false,
  })

  const navigate = useNavigate();



  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <Typography varient="h2" component="h2">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField error={room.isError}
          required={true}
          label="Code"
          placeholder="Enter a Room Code"
          value={room.roomCode}
          helperText={room.errorMsg}
          variant="outlined"
          onChange={(event) => {
            setRoom({
              ...room,
              roomCode: event.target.value
            })
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" color="primary" onClick={() => joinRoom(room, setRoom, navigate)} component={Link}>Enter Room</Button>
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
      </Grid>
    </Grid>
  )
};

async function joinRoom(room, setRoom, navigate) {
  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body:JSON.stringify({
      code: room.roomCode
    })
  };

  const response = await fetch("/api/join-room", requestOptions);
  if (response.ok) {
    setRoom({
      ...room,
      isError: false,
      errorMsg: ""
    })
    navigate(`/room/${room.roomCode}`);
  } else {
    setRoom({
      ...room,
      isError: true,
      errorMsg: "Room not found."
    })
  };
};
