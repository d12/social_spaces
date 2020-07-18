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
import { makeStyles } from "@material-ui/core/styles";
import {
  useForm,
  useField,
  submitSuccess,
  notEmpty,
  notEmptyString,
} from "@shopify/react-form";

import { yam } from "images";
import { AppFrame } from "../AppFrame";

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
  alertToast: string;
  noticeToast: string;
}

export default function GroupIndex({ alertToast, noticeToast }: Props) {
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
    },
    onSubmit: async ({ groupId }) => {
      window.location.href = `/join/${groupId}`;
      handleModalClose();
      return submitSuccess();
    },
  });

  console.log(fields.groupId.error);
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
        <Button onClick={submit} color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <AppFrame alertToast={alertToast} noticeToast={noticeToast}>
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
                  rel="nofollow"
                  data-method="post"
                  href="/groups"
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
}
