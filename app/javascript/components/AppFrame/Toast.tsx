import React from "react";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export enum ToastSeverity {
  ERROR = "error",
  WARNING = "warning",
}

interface Props {
  message: string;
  severity: ToastSeverity;
}

export default function Toast({ message, severity }: Props) {
  const [open, setOpen] = React.useState(true);

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
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        varient="filled"
        onClose={handleClose}
        severity={severity}
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
