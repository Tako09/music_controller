import React, { Component, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
} from "@mui/material"
import { render } from "react-dom";
import CreateRoomPage from "./CreateRoomPage";


// need to refactor
export default function Room({room, setRoom}) { // {variable} とすることで親コンポーネントからのあたいの受け渡しができる
  const navigate = useNavigate();
  // console.log(room)
  const getRoomDetails = useEffect(() => {
    const fetchRoom = async () => {
      const response = await fetch(`/api/get-room?code=${room.roomCode}`);
      if (response.ok){
        const data = await response.json();
        setRoom({
          ...room,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        })
      } else {
        setRoom({
          ...room,
          roomCode: null
        });
        navigate("/");
      }
    };

    fetchRoom();
  }, [room.roomCode]); // この配列(依存配列)に監視したい変数を入れる。その変数が更新されるとuseEffectが動く
  
  getRoomDetails

  function updateShowSettings(value) {
    setRoom({
      ...room,
      showSettings: value,
      update: true
    })
  }

  function RenderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={ () => updateShowSettings(true)} >
          Settings
        </Button>
      </Grid>
    )
  };

  function RenderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            room={room}
            setRoom={setRoom}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick={ () =>
            setRoom({
              ...room,
              showSettings: false
            })
          }>
              Close
          </Button>
        </Grid>
      </Grid>
    )
  }

  if (room.showSettings) {
    return (
      <RenderSettings />
    );
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code : {room.roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h4">
          Votes : {room.votesToSkip.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h4">
          Guest Can Pause : {room.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h4">
          Host : {room.isHost.toString()}
        </Typography>
      </Grid>
      {room.isHost ? RenderSettingsButton(): null}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={() => {
          leaveButtonPressed(navigate, room, setRoom)
        }}  component={Link}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

function leaveButtonPressed(navigate, room, setRoom) {
  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
  };
  fetch("/api/leave-room", requestOptions).then((_response) => {
    setRoom({
      ...room,
      roomCode: null
    });
    navigate("/");
  });
};
