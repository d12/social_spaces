import React from "react";
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
} from "@material-ui/core";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import { theme } from "theme";

export interface Props {
  children?: React.ReactNode;
  groupTabProps?: {
    users: User[];
    groupId: string;
    meetUrl: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  appTitle: {
    flexGrow: 1,
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  mainBody: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

export function AppFrame({ children, groupTabProps }: Props) {
  const classes = useStyles();

  const groupBarMarkup = groupTabProps && (
    <Grid item>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
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
        <Divider variant="middle" />
        <List>
          {groupTabProps.users.map(({ email, name }) => (
            <ListItem alignItems="center" key={email}>
              <ListItemAvatar>
                <Avatar alt={name} />
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Grid>
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item className={classes.mainBody}>
          <AppBar color="transparent" variant="outlined">
            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.appTitle}>
                Social Spaces
              </Typography>
              <Link
                rel="nofollow"
                data-method="delete"
                href="/logout"
                underline="none"
                color="textSecondary"
              >
                <Button color="inherit">Logout</Button>
              </Link>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">{children}</Container>
        </Grid>
        {groupBarMarkup}
      </Grid>
    </ThemeProvider>
  );
}