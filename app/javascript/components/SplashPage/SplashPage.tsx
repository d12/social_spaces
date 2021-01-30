import React from "react";

interface Props {
  groupKey?: string;
  groupName?: string;
}

export default function SplashPage({ groupKey }: Props) {
  const loginUrl = groupKey ? `/login/google/join/${groupKey}` : "/login/google";
  const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  return (
    <>
      <h2>Welcome to SocialSpaces.</h2>
      <br />
      <a href={loginUrl}>Login with Google</a>
      <br />
      <br />
      Or, play as a guest.
      <br />
      <form action="/guest_signup" method="post" autoComplete="off">
        Name:
        <input id="name" name="name" type="textbox"></input>
        <input type="submit" value="Submit"></input>
        <input type="hidden" name="authenticity_token" value={csrf}></input>
        <input type="hidden" name="groupKey" value={groupKey || ""}></input>
      </form>
    </>
  );
}

// import React, { useState } from "react";
// import {
//   Grid,
//   Typography,
//   Paper,
//   ButtonBase,
//   Link,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
//   TextField,
//   IconButton,
// } from "@material-ui/core";
// import { makeStyles, Theme } from "@material-ui/core/styles";
// import {
//   useForm,
//   useField,
//   submitSuccess,
//   notEmpty,
//   notEmptyString,
// } from "@shopify/react-form";

// import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// import { joinTeam, createTeam } from "images";
// import { AppFrame } from "../AppFrame";
// import { User, Group } from "../ApplicationRoot";
// import { API } from "../modules/API";
// import { plainTheme } from "../../theme";

// const useStyles = makeStyles((theme) => ({
//   wrapper: {
//     flexGrow: 1,
//     display: "flex",
//     justifyContent: "center",
//     height: "100vh",
//   },
//   option: {
//     height: "350px",
//     width: "290px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// }));

// export interface Props {
//   groupKey?: string;
//   groupName?: string;
// }

// export default function SplashPage({ groupKey, groupName }: Props) {
//   const classes = useStyles();
//   const [modalOpen, setModalOpen] = useState(false);

//   const requiredErrorMessage = "This field is required";
//   const required = [
//     notEmpty(requiredErrorMessage),
//     notEmptyString(requiredErrorMessage),
//   ];

//   const { fields, submit } = useForm({
//     fields: {
//       name: useField<string>({ value: "", validates: required }),
//     }
//   });

//   const title = (groupKey && groupName) ? `Welcome! Enter a name below to join ${groupName}'s group.` : "Welcome! Please enter a name to begin.";

//   return (
//     <AppFrame>
//       <Box className={classes.wrapper}>
//         <Grid
//           container
//           direction="column"
//           justify="center"
//           alignItems="center"
//           spacing={8}
//         >
//           <Grid item>
//             <Typography variant="h4">{title}</Typography>
//           </Grid>
//           <Grid item>
//             <TextField
//               error={fields.name.error !== undefined}
//               helperText={fields.name.error}
//               autoFocus
//               margin="dense"
//               id="groupId"
//               placeholder="Name"
//               fullWidth
//               value={fields.name.value}
//               onChange={fields.name.onChange as any}
//               style={{ width: "600px", fontSize: "22px" }}
//             />
//             <IconButton aria-label="submit" onClick={submit}>
//               <ChevronRightIcon />
//             </IconButton>
//           </Grid>
//         </Grid>
//       </Box>
//     </AppFrame>
//   );
// }
