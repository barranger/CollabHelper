import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  box: {
    backgroundColor: "#bccbde",
    padding: "2.5em",
    borderRadius: 12,
    margin: "1em",
  },
  text: {
    marginTop: 14,
    marginBottom: 14
  }
}));

const Box = props => {
  const classes = useStyles();

  return (
    <Grid
      container
      align="center"
      justify="center"
      className={classes.root}
      spacing={0}
    >
      <Grid item className={classes.box} xs={12}>
        {props.children}
      </Grid>
    </Grid>
  );
};

export default Box;
