import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { ThemeProvider, makeStyles, Theme } from "@material-ui/core/styles";
import Toast, { ToastSeverity } from "./Toast";
import createAuthedConsumer from "../../channels/consumer";

import { User, Group } from "../ApplicationRoot";
import { API } from "../modules/API";

import { jitsiBackground } from "../../images";

import blobForUser from "../modules/Blob";

declare var JitsiMeetExternalAPI: any;

export interface Props {
  children?: React.ReactNode;
  user?: User;
  showGroupTab?: boolean;
  group?: Group;
  setGroupCallback?(group: Group): void;
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

declare global {
  interface Window {
    opera: any; // Add missing method to window
  }
}

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
  const [mobileDialogOpened, setMobileDialogOpened] = useState<boolean>(false);
  const [openMobileDialog, setOpenMobileDialog] = useState<boolean>(false);

  if (isMobileBrowser() && !mobileDialogOpened && !openMobileDialog) {
    setOpenMobileDialog(true);
  }

  useEffect(() => {
    if (!user)
      return;

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
  }, [user]);

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
            {group.users.map(({ email, name, gravatarUrl, id, blobId }) => (
              <ListItem alignItems="center" key={id}>
                <ListItemAvatar>
                  <Avatar alt={name} src={blobForUser(blobId)} />
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

  const leaveGroupMarkup = group && group.activity && (
    <Link
      onClick={LeaveGroup}
      underline="none"
      color="textSecondary"
      className={classes.topBarButton}
    >
      <Button color="inherit">Leave Group</Button>
    </Link>
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

  const logoutButtonMarkup = user && (
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
  );

  const endActivityMarkup = endActivityHostMarkup || endActivityNotHostMarkup;

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
              {leaveGroupMarkup}
              {logoutButtonMarkup}
            </Toolbar>
          </AppBar>
          <Container className={classes.activityContainer}>{children}</Container>
        </Grid>
        {groupBarMarkup}
        {/* <Box className={classes.video} id="video-container">
        </Box> */}
      </Grid>
      <Dialog
        open={openMobileDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle id="alert-dialog-title"><strong>This website does not support mobile browsers.</strong></DialogTitle>
        <DialogContent>
          <DialogContentText>
            While in beta, you may experience layout and formatting issues on mobile.
          </DialogContentText>
          <DialogContentText>
            We recommend using a non-mobile device.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  function handleCloseDialog() {
    setOpenMobileDialog(false);
    setMobileDialogOpened(true);
  }

  // From detectmobilebrowsers.com, includes tablets
  function isMobileBrowser() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

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
