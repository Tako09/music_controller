import React, { Component, useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  ButtonGroup
} from "@mui/material"

export default function HomePage() {

  const [room, setRoom] = useState({
    roomCode: null,
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    update: false,
    successMsg: "",
    errorMsg: "",
    spotifyAuthenticated: false
  });

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/user-in-room")
      const data = await response.json()
      setRoom({
        ...room,
        roomCode: data.code
      });
    };

    fetchSession();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={room.roomCode ? <Navigate to={`/room/${room.roomCode}`} /> : <RenderHomePage />} />
        <Route path="/join" element={<RoomJoinPage />}/>
        <Route path="/create" element={<CreateRoomPage   room={room} setRoom={setRoom} />} />
        <Route path="/room/:roomCode" element={<Room roomCode={room.roomCode} room={room} setRoom={setRoom} />} /> {/* 変数名=変数 で値を渡す(直接参照になる) */}
      </Routes>
      <Outlet/>
    </Router>
  );
  
};

function RenderHomePage() {
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h3" component="h3">House Party</Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>Join a Room</Button>
          <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};
