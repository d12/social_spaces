import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Link,
} from "@material-ui/core";
import { ThemeProvider, makeStyles } from "@material-ui/core/styles";
import { theme } from "theme";

export interface Props {
  children?: React.ReactNode;
  groupTabProps?: {
    users: User[];
    groupKey: string;
    meetUrl: string;
  };
  centered?: boolean;
}

interface User {
  id: number;
  name: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export function AppFrame({ children, groupTabProps }: Props) {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar color="transparent" variant="outlined">
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.root}>
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
      </div>
      <Container>{children}</Container>
    </ThemeProvider>
  );
}
