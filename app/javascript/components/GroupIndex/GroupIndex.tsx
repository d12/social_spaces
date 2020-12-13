import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  ButtonBase,
  Link,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  useForm,
  useField,
  submitSuccess,
  notEmpty,
  notEmptyString,
} from "@shopify/react-form";

import { yam } from "images";
import { AppFrame } from "../AppFrame";
import { User, Group } from "../ApplicationRoot";
import { API } from "../modules/API";
import { plainTheme } from "../../theme";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    height: "100vh",
  },
  option: {
    height: "350px",
    width: "290px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export interface Props {
  alertToast?: string;
  noticeToast?: string;
  user: User;
  setGroupCallback(group: Group): void;
}

export default function GroupIndex({ alertToast, noticeToast, setGroupCallback, user }: Props) {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const requiredErrorMessage = "This field is required";
  const required = [
    notEmpty(requiredErrorMessage),
    notEmptyString(requiredErrorMessage),
  ];

  const { fields, submit } = useForm({
    fields: {
      groupId: useField<string>({ value: "", validates: required }),
    }
  });

  const modalMarkup = (
    <Dialog
      open={modalOpen}
      onClose={handleModalClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Join a group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join an existing group, please enter the group ID here.
        </DialogContentText>
        <TextField
          error={fields.groupId.error !== undefined}
          helperText={fields.groupId.error}
          autoFocus
          margin="dense"
          id="groupId"
          label="Group code"
          fullWidth
          value={fields.groupId.value}
          onChange={fields.groupId.onChange as any}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => joinGroup(fields.groupId.value)} color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <AppFrame alertToast={alertToast} noticeToast={noticeToast} user={user} group={null} setGroupCallback={setGroupCallback}>
      {modalMarkup}
      <Box className={classes.wrapper}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={8}
        >
          <Grid item>
            <Typography variant="h4">Find a group for a game</Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={8}
            >
              <Grid item>
                <ButtonBase onClick={handleModalOpen}>
                  <Paper className={classes.option}>
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                      spacing={3}
                    >
                      <Grid item>
                        <img src={yam} />
                      </Grid>
                      <Grid item>
                        <Typography variant="h5">Join a group</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </ButtonBase>
              </Grid>
              <Grid item>
                <Link
                  onClick={createGroup}
                  underline="none"
                  color="textPrimary"
                >
                  <ButtonBase>
                    <Paper className={classes.option}>
                      <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        spacing={3}
                      >
                        <Grid item>
                          <img src={yam} />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">Create new group</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </ButtonBase>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </AppFrame>
  );

  function handleModalOpen() {
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  async function createGroup() {
    const response = await API.createGroup();

    if (response["errors"] === undefined) {
      // This should just setGroupCallback(response);, but we need to force the video to load in. And I haven't done that yet.
      location.reload();
    } else {
      alert(response["errors"]);
    }
  }

  async function joinGroup(groupKey: string) {
    const response = await API.joinGroup(groupKey);

    if (response["errors"] === undefined) {
      location.reload();
    } else {
      alert(response["errors"]);
    }
  }
}
