import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  whiteBg: {
    backgroundColor: 'white',
  },
  button: {
    marginTop: 14,
  },
}));

const RequestDialog = (props) => {
  const { open, setOpen } = props;
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.whiteBg} id="alert-dialog-title">
        Request an item??
      </DialogTitle>
      <DialogContent className={classes.whiteBg}>
        <DialogContentText id="alert-dialog-description">
          By Requesting an item to be picked up for you, you are acknowledging
          that you will pay for the item. Payment for the item must be done
          between you and the person picking up the item, and will not be done
          by this app.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.whiteBg}>
        <Button onClick={() => setOpen(false)} color="primary">
          Disagree
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            props.requestItem();
          }}
          color="primary"
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestDialog;
