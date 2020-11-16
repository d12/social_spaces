import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  Grid,
  Box,
  TextField,
  Paper,
} from "@material-ui/core";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import { theme } from "theme";
import Toast, { ToastSeverity } from "./Toast";
import consumer from "../../channels/consumer";

declare var JitsiMeetExternalAPI: any;

export interface Props {
  children?: React.ReactNode;
  groupTabProps?: {
    users: User[];
    groupId: string;
    meetUrl: string;
  };
  alertToast: string;
  noticeToast: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  gravatarUrl: string;
}

const drawerWidth = 350;
const buttonWidth = drawerWidth * 0.8;

const useStyles = makeStyles((_theme) => ({
  appTitle: {
    flexGrow: 1,
  },
  appBar: {
    flexGrow: 1,
    marginLeft: drawerWidth,
  },
  mainBody: {
    flexGrow: 1,
  },
  drawerPaper: {
    width: drawerWidth,
    height: "100%",
  },
  leaveGroupButton: {
    width: buttonWidth,
    marginTop: "auto"
  },
  leaveGroupLink: {
    width: buttonWidth,
    marginLeft: (drawerWidth - buttonWidth) / 2,
    marginBottom: (drawerWidth - buttonWidth) / 2,
    marginTop: "auto",
  },
  logoutWithDrawer: {
  },
  container: {
    flexWrap: "nowrap",
  },
  drawerFlexBox: {
    height: "100%",
    flexDirection: "column"
  },
  foo: {
    width: "800px",
  },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  }
}));

export function AppFrame({
  children,
  groupTabProps,
  alertToast,
  noticeToast,
}: Props) {
  function navigateToActivity(): void {
    window.location.replace("/play");
  }

  useEffect(() => {
    groupTabProps &&
      consumer.subscriptions.create(
        { channel: "GroupChannel", group_id: groupTabProps.groupId },
        {
          received: ({ type, user }) => {
            switch (type) {
              case "JOINED":
                // TODO
                // addUser(user);
                console.log("User joined but UI update not implemented yet");
                break;
              case "LEFT":
                // TODO
                // removeUser(user);
                console.log("User left but UI update not implemented yet");
                break;
              case "ACTIVITY_START":
                navigateToActivity();
                break;
              default:
                console.error("Unexpected message");
            }
          },
        }
      );

      const domain = '8x8.vc';
      const options = {
          roomName: 'vpaas-magic-cookie-cb5f846d50d54f4eb3ecfbdfc3875b94/Testing',
          interfaceConfigOverwrite: {
            TILE_VIEW_MAX_COLUMNS: 1,
            DISPLAY_WELCOME_FOOTER: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
            DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
            DISABLE_VIDEO_BACKGROUND: true,
            GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
            HIDE_INVITE_MORE_HEADER: true,
            MOBILE_APP_PROMO: false,
            RECENT_LIST_ENABLED: false,
            SHOW_CHROME_EXTENSION_BANNER: false,
            SHOW_JITSI_WATERMARK: false,
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'chat',
              'settings',
              'videoquality',
              'tileview',
            ],
            VERTICAL_FILMSTRIP: true,
            VIDEO_QUALITY_LABEL_DISABLED: true
          },
          jwt: "eyJhbGciOiJSUzI1NiIsImtpZCI6InZwYWFzLW1hZ2ljLWNvb2tpZS1jYjVmODQ2ZDUwZDU0ZjRlYjNlY2ZiZGZjMzg3NWI5NC9kMjUwZmMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJqaXRzaSIsImNvbnRleHQiOnsidXNlciI6eyJpZCI6IjEiLCJuYW1lIjoiTmF0aGFuaWVsIFdvb2R0aG9ycGUiLCJhdmF0YXIiOiJodHRwczovL2F2YXRhcnMwLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzMwOTIwMjE2IiwiZW1haWwiOiJuandvb2R0aG9ycGVAZ21haWwuY29tIiwibW9kZXJhdG9yIjoidHJ1ZSJ9LCJmZWF0dXJlcyI6eyJsaXZlc3RyZWFtaW5nIjoidHJ1ZSIsInJlY29yZGluZyI6ImZhbHNlIn19LCJleHAiOjE2MDU0OTk3ODIsImlzcyI6ImNoYXQiLCJuYmYiOjE2MDU0OTYwODIsInJvb20iOiIqIiwic3ViIjoidnBhYXMtbWFnaWMtY29va2llLWNiNWY4NDZkNTBkNTRmNGViM2VjZmJkZmMzODc1Yjk0In0.Pf_R2dJSU5MLb0lQ2jtoYxqLQJO9mwC6p6bhvTzO5Azvu_Dw9DBNeah0VuROAhu3SvJH40YAIyClFnaKfytrQlc91mZLK5sPDSlLXpW6--uWfXVn7k7dvYzRENa82YtU6N61O6s3XXDYfhVVaurrmPT1D8_hdJilcsGbOPjqKrDpzrgAmyR_6kTDgJxEwumyTNa6D8MSrJoPgGFWa1n97u3vy_OQg8QpdYwLqNUPWnh-i2VhZlrx0VX-JwGDqgaxDvw9_-eAMArXTcID5WPCy3x9Q8uYX5IAZgWgYTzMHUU6ZJ3kkIkfY7NLwQ6S2ZvHKOQsIQtudhq5isoREQiMF3289-phTsNlBVmh1zfMfh_ogi8di21GmAnWbBHdSar-SWhQ69ANkaADhMmY4uT1m9995Z6FIyrNZzeEODETT1m5oLPFoZh3TF-TSYf6cOZXhfGqGLvoT89oVKvxIHtKQDAS1-lGljr38woi7R4I8tJeC9g7IKNoK7y0Dd9RhB6ABdnGVnO-NLdT9MZOeCdEKVPNKcJuFTjJpxvLFx4ibynkIdBrYfdalrZEpah08bX8MMCwkh9MbfaLCeTQOj8185ofFyJ5MQdPuYPpu-WrFJauRsV4LSFFvkm7TR-vjMgnR-XddOExCOUkPHCw2AsDfr6_Ht0cUul9omTikV8Sydg",
          parentNode: document.querySelector('#video-container')
      };

      const api = new JitsiMeetExternalAPI(domain, options);
  }, []);

  const classes = useStyles();

  const groupBarMarkup = groupTabProps && (
    <Grid item>
      <Paper
        className={classes.drawerPaper}
      >
        <Grid
          container
          className={classes.drawerFlexBox}
        >
          <Box p={2}>
            <Typography variant="h5">My Group</Typography>
            <TextField
              label="Google Meet URL"
              InputProps={{
                readOnly: true,
              }}
              value={groupTabProps.meetUrl}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Group Code"
              InputProps={{
                readOnly: true,
              }}
              value={groupTabProps.groupId}
              fullWidth
              margin="dense"
            />
          </Box>
          <List>
            {groupTabProps.users.map(({ email, name, gravatarUrl }) => (
              <ListItem alignItems="center" key={email}>
                <ListItemAvatar>
                  <Avatar alt={name} src={gravatarUrl} />
                </ListItemAvatar>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
          <Link
            rel="nofollow"
            data-method="delete"
            href="/leave_group"
            underline="none"
            color="textPrimary"
            className={classes.leaveGroupLink}
          >
            <Button
              variant="outlined"
              color="secondary"
              className={classes.leaveGroupButton}
            >
              Leave Group
            </Button>
          </Link>
        </Grid>
      </Paper>
    </Grid>
  );

  const navbar = window.location.search;
  const params = new URLSearchParams(navbar);
  const reason = params.get("reason");

  noticeToast =
    reason == "host_ended" ? "The host has ended the activity" : noticeToast;
  noticeToast =
    reason == "not_enough_players"
      ? "The activity has ended because there are not enough players to play."
      : noticeToast;

  const alertMarkup = alertToast && (
    <Toast message={alertToast} severity={ToastSeverity.ERROR} />
  );
  const noticeMarkup = noticeToast && (
    <Toast message={noticeToast} severity={ToastSeverity.INFO} />
  );



  return (
    <ThemeProvider theme={theme}>
      {alertMarkup || noticeMarkup}
      <Grid
       container
       direction="row"
       justify="flex-start"
       align-items="flex-start"
       className={classes.container}
      >
        <Grid item className={classes.mainBody}>
          <AppBar color="transparent" variant="outlined" position="relative">
            <Toolbar variant="dense" className={classes.headerBox}>
              <Typography variant="h6" className={classes.appTitle}>
                Social Spaces
              </Typography>
              <Link
                rel="nofollow"
                data-method="delete"
                href="/logout"
                underline="none"
                color="textSecondary"
                className={groupTabProps ? classes.logoutWithDrawer : ""}
              >
                <Button color="inherit">Logout</Button>
              </Link>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">{children}</Container>
        </Grid>
        {groupBarMarkup}
        <Box className={classes.foo} id="video-container">
        </Box>
      </Grid>
    </ThemeProvider>
  );
}
