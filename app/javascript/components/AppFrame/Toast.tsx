import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export enum ToastSeverity {
  ERROR = "error",
  INFO = "info",
}

interface Props {
  message: string;
  severity: ToastSeverity;
}

const useStyles = makeStyles((_theme) => ({
  alert: {
    width: "400px",
  },
}));

export default function Toast({ message, severity }: Props) {
  const [open, setOpen] = React.useState(true);

  const classes = useStyles();

  function handleClose(_event: any) {
    setOpen(false);
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <Alert
        varient="filled"
        onClose={handleClose}
        severity={severity}
        className={classes.alert}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
