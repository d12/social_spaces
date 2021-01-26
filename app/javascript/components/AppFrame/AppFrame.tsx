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
  Tooltip,
} from "@material-ui/core";
import { ThemeProvider, makeStyles, Theme } from "@material-ui/core/styles";
import Toast, { ToastSeverity } from "./Toast";
import createAuthedConsumer from "../../channels/consumer";

import { User, Group } from "../ApplicationRoot";
import { API } from "../modules/API";

import { jitsiBackground } from "../../images";

import {
  blobBlue,
  blobGreen,
  blobPink,
  blobPurple,
  blobYellow
} from "../../images";

function blobForId(id: number) {
  switch (id % 5) {
    case 0: return blobBlue;
    case 1: return blobGreen;
    case 2: return blobYellow;
    case 3: return blobPurple;
    case 4: return blobPink;
  }
}

declare var JitsiMeetExternalAPI: any;

export interface Props {
  children?: React.ReactNode;
  user: User;
  showGroupTab?: boolean;
  group?: Group;
  setGroupCallback(group: Group): void;
  alertToast?: string;
  noticeToast?: string;
  toasts?: Array<string>;
}

const drawerWidth = 350;
const buttonWidth = drawerWidth * 0.8;
const headerPadding = 2;
const headerHeight = 50;

const useStyles = makeStyles((_theme) => ({
  appTitle: {
    flexGrow: 1,
  },
  appBar: {
    flexGrow: 1,
    marginLeft: drawerWidth,
  },
  appBarBorder: {
    borderBottomColor: _theme.palette.divider,
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
  topBarButton: {
    marginLeft: "40px",
  },
  container: {
    flexWrap: "nowrap",
    height: "100vh",
  },
  drawerFlexBox: {
    height: "100%",
    flexDirection: "column"
  },
  video: {
    width: "358px",
    backgroundColor: "grey",
    background: `url(${jitsiBackground}) no-repeat`,
    backgroundSize: "contain",
  },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: headerHeight,
    backgroundColor: _theme.palette.background.default,
  },
  activityContainer: {
    height: "calc(100% - " + (headerHeight + headerPadding) + "px)",
    backgroundColor: _theme.palette.background.default,
    width: "100%",
    maxWidth: "100%",
  }
}));

export function AppFrame({
  children,
  user,
  group,
  showGroupTab,
  setGroupCallback,
  alertToast,
  noticeToast,
  toasts,
}: Props) {
  useEffect(() => {
    const consumer = createAuthedConsumer(user.wsToken);

    if (group) {
      consumer.subscriptions.create(
        { channel: "GroupChannel", group_id: group.key },
        {
          received: ({ type }) => {
            switch (type) {
              case "JOINED":
                GetGroupAndSet();
                break;
              case "LEFT":
                GetGroupAndSet();
                break;
              case "ACTIVITY_START":
                GetGroupAndSet();
                break;

              case "ACTIVITY_END":
                GetGroupAndSet();
                break;

              default:
                console.error("Unexpected message: " + type);
            }
          },
        }
      );

      // const domain = '8x8.vc';
      // const options = {
      //     roomName: "vpaas-magic-cookie-cb5f846d50d54f4eb3ecfbdfc3875b94/" +  (group.key),
      //     interfaceConfigOverwrite: {
      //       TILE_VIEW_MAX_COLUMNS: 1,
      //       DISPLAY_WELCOME_FOOTER: false,
      //       DISPLAY_WELCOME_PAGE_CONTENT: false,
      //       DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
      //       DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
      //       DISABLE_VIDEO_BACKGROUND: true,
      //       GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
      //       HIDE_INVITE_MORE_HEADER: true,
      //       MOBILE_APP_PROMO: false,
      //       RECENT_LIST_ENABLED: false,
      //       SHOW_CHROME_EXTENSION_BANNER: false,
      //       SHOW_JITSI_WATERMARK: false,
      //       SHOW_POWERED_BY: false,
      //       SHOW_PROMOTIONAL_CLOSE_PAGE: false,
      //       TOOLBAR_ALWAYS_VISIBLE: false,
      //       TOOLBAR_BUTTONS: [
      //         'microphone',
      //         'camera',
      //         'desktop',
      //         'fullscreen',
      //         'fodeviceselection',
      //         'chat',
      //         'settings',
      //         'videoquality',
      //         'tileview',
      //       ],
      //       VERTICAL_FILMSTRIP: true,
      //       VIDEO_QUALITY_LABEL_DISABLED: true
      //     },
      //     jwt: user.jitsiJwt,
      //     configOverwrite: {
      //       enableInsecureRoomNameWarning: false,
      //     },
      //     parentNode: document.querySelector('#video-container')
      // };

      // if(user.jitsiJwt != null)
      //   new JitsiMeetExternalAPI(domain, options);

      history.replaceState(null, "", `/groups/${group.key}`);
    }
  }, []);

  const classes = useStyles();

  // TODO: Break all the group panel stuff into it's own component

  const hostId = group && group.hostId;
  const inviteUrl = group && window.location.origin + "/groups/" + group.key;

  const groupBarMarkup = group && showGroupTab && (
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
              label="Invite URL"
              InputProps={{
                readOnly: true,
              }}
              value={inviteUrl}
              fullWidth
              margin="dense"
            />
          </Box>
          <List>
            {group.users.map(({ email, name, gravatarUrl, id }) => (
              <ListItem alignItems="center" key={id}>
                <ListItemAvatar>
                  <Avatar alt={name} src={blobForId(id)} />
                </ListItemAvatar>
                <ListItemText primary={name} />
                {hostId == id ? "⭐️" : null}
              </ListItem>
            ))}
          </List>
          <Link
            rel="nofollow"
            onClick={LeaveGroup}
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

  const endActivityHostMarkup = group && group.activity && (user.id == group.hostId) && (
    <Link
      onClick={EndActivity}
      underline="none"
      color="textSecondary"
      className={classes.topBarButton}
    >
      <Button color="inherit">End Activity</Button>
    </Link>
  );

  const endActivityNotHostMarkup = group && group.activity && (user.id !== group.hostId) && (
    <Tooltip
      title={<span style={{ fontSize: "14px" }}>Only the host can end the activity.</span>}
    >
      <Link
        onClick={EndActivity}
        underline="none"
        color="textSecondary"
        className={classes.topBarButton}
      >
        <Button color="inherit" disabled={true}>End Activity</Button>
      </Link>
    </Tooltip>
  );

  const endActivityMarkup = endActivityHostMarkup || endActivityNotHostMarkup

  return (
    <>
      {alertMarkup || noticeMarkup}
      <Grid
        container
        direction="row"
        justify="flex-start"
        align-items="flex-start"
        className={classes.container}
      >
        <Grid item className={classes.mainBody}>
          <AppBar color="transparent" variant="outlined" position="relative" className={classes.appBarBorder}>
            <Toolbar variant="dense" className={classes.headerBox}>
              <Typography variant="h6" className={classes.appTitle}>
                Social Spaces
              </Typography>
              {endActivityMarkup}
              <Link
                rel="nofollow"
                data-method="delete"
                href="/logout"
                underline="none"
                color="textSecondary"
                className={classes.topBarButton}
              >
                <Button color="inherit">Logout</Button>
              </Link>
            </Toolbar>
          </AppBar>
          <Container className={classes.activityContainer}>{children}</Container>
        </Grid>
        {groupBarMarkup}
        {/* <Box className={classes.video} id="video-container">
        </Box> */}
      </Grid>
    </>
  );

  function EndActivity() {
    API.endActivity(group.key);
  }

  async function GetGroupAndSet() {
    const response = await API.getGroup(group.key);
    setGroupCallback(response);
  }

  async function LeaveGroup() {
    await API.leaveGroup();
    document.location.href = "/";
  }
}
