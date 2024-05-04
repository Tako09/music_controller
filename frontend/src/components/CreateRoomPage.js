import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import { Link, useNavigate } from "react-router-dom"

// matterial-UI document https://mui.com/material-ui/getting-started/usage/
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
} from "@mui/material"

export default function CreateRoomPage({room, setRoom}) {

  const navigate = useNavigate();

  function handleVoteschange(e) { // function to change the votesToSkip in state
    setRoom({
      ...room,
      votesToSkip: e.target.value
    });
  };
  
  function handleGuestCanPauseChange(e) {
    setRoom ({
      ...room,
      guestCanPause: e.target.value === "true" ? true : false,
    });
  };

  function RenderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={() =>  handleRoomButtonPressed(room, setRoom, navigate)} component={Link}>
            Create A Room
          </Button>
      </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
    </Grid>
    );
  };

  function RenderUpdateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={() => handleUpdateButtonPressed(room, setRoom)} >
            Update Room
          </Button>
      </Grid>
    </Grid>
    );
  };

  // {} need to put javascript object
  const title = room.update ? "Update Room" : "Create a Room";
  return(
    <Grid container spacing={1}> 
      <Grid item xs={12} align="center">
        <Collapse in={room.successMsg != "" || room.errorMsg != ""}>
          {room.successMsg != "" ? (<Alert>{room.successMsg}</Alert>) : (<Alert>{room.errorMsg}</Alert>)}
        </Collapse>
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">
              Guest Control of Playback State
            </div>
          </FormHelperText>
          <RadioGroup row value={room.guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            value={room.votesToSkip}
            inputProps={{
              min: 1, // dont accept negative or zero
              style: { textAlign: "center" },
            }}
            variant="standard"
            onChange={handleVoteschange}
          />
          <FormHelperText>
            <div align="center">
              Votes Required to Skip Song
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {room.update ? RenderUpdateButtons() : RenderCreateButtons()}
    </Grid>
  )
};

async function handleRoomButtonPressed(room, setRoom, navigate) { // apiにデータを送って返り値を元に画面遷移をする
  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      votes_to_skip: room.votesToSkip,
      guest_can_pause: room.guestCanPause
    })
    };
  
  const response = await fetch("/api/create-room", requestOptions) // send a data to api
  const data = await response.json(); // take a response // log response data 
  const code = await data.code;
  setRoom({
    ...room,
    roomCode: code
  })
  navigate(`/room/${code}`)
};

async function handleUpdateButtonPressed(room, setRoom) { // apiにデータを送って返り値を元に画面遷移をする
  const requestOptions = {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      votes_to_skip: room.votesToSkip,
      guest_can_pause: room.guestCanPause,
      code: room.roomCode
    })
  };
  
  const response = await fetch("/api/update-room", requestOptions) // send a data to api
  const result = response.ok; // take a response // log response data \
  if (result) {
    setRoom({
      ...room,
      successMsg: "Room updated successfully!",
      errorMsg: "",
      votesToSkip: room.votesToSkip,
      guestCanPause: room.guestCanPause,
      showSettings: true,
    });
  } else {
    setRoom({
      ...room,
      successMsg: "",
      errorMsg: "Error updating room...",
    })
  };
};