import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography } from '@material-ui/core';

import { CustomTooltip } from '../../../../../components';
import CheckImage from '../../../../../assets/img/icons/check.svg';
import UncheckImage from '../../../../../assets/img/icons/uncheck.svg';

const styles = theme => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1.5)
    },
    img: {
      marginRight: theme.spacing(1)
    },
    description: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.palette.craneForeColor
    }
  };
};

const RecommendRules = ({ classes, rules }) => {

  return (
    <>
      {rules.map(({ img, description, tooltip }, index) => (
        <div key={index} className={classes.root}>
          <img
            src={img}
            className={classes.img}
            alt=''
          />
          <Typography className={classes.description}>
            {description}
            {
              !!tooltip &&
              <CustomTooltip
                title={tooltip} />
            }
          </Typography>
        </div>
      ))}
    </>
  );
};

RecommendRules.propTypes = {
  classes: PropTypes.object.isRequired,
  rules: PropTypes.array
};

RecommendRules.defaultProps = {
  rules: [
    {
      img: CheckImage,
      description: 'Peers, direct reports, managers, or clients',
    },
    {
      img: CheckImage,
      description: 'Current or past co-workers',
      tooltip: `Up to you! We don’t expect current but we welcome anyone. 
      Think back across your long career.`
    },
    {
      img: CheckImage,
      description: 'Either looking or not looking for a job currently',
      tooltip: `We just want to hear about remarkable people! Most people
       are open to hearing about other opportunities regardless of what 
       they're up to.Plus, they might be looking for opportunities in 
       the future.`
    },
    {
      img: CheckImage,
      description: 'Someone with 3 to 10 years of experience'
    },
    {
      img: UncheckImage,
      description: 'Family members or good friends who you never worked with'
    }
  ]
};

export default withStyles(styles)(RecommendRules);