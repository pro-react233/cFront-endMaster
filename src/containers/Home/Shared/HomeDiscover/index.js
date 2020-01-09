import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography } from '@material-ui/core';

import DiscoverImage from '../../../../assets/img/background/homeDiscover.png';

const styles = theme => {
  return {
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      margin: `${theme.spacing(5)}px 0`,
      [theme.breakpoints.down('sm')]: {
        margin: `${theme.spacing(3)}px 0`
      }
    },
    title: {
      fontSize: 42,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        fontSize: 32
      }
    },
    description: {
      fontSize: 20,
      textAlign: 'center',
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        fontSize: 16
      }
    },
    img: {
      width: '70%',
      margin: theme.spacing(5),
      boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.25)',
      borderRadius: 10,
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    }
  };
};

const HomeDiscover = ({ classes }) => {
  return (
    <main className={classes.root}>
      <Typography className={classes.title}>
        Build your dream team.
      </Typography>
      <Typography className={classes.description}>
        Discover remarkable people you can count on.
        <br />
        Go beyond basic profiles and hear what really matters.
      </Typography>
      <img
        src={DiscoverImage}
        className={classes.img}
        alt=''
      />
    </main>
  );
};

HomeDiscover.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomeDiscover);
