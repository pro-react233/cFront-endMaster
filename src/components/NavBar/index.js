
import React from 'react';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button } from '@material-ui/core';

import { pageLinks, defaultAvatarLink } from '../../constants/links'
import { roles } from '../../constants/roles';
import { hasValidToken } from '../../utils/utility';
import { ProfileDropdown } from '../index';
import LogoImage from '../../assets/img/logo.png';

const styles = theme => {
  return {
    appBar: {
      backgroundColor: theme.palette.mainBackColor,
    },
    toolbar: {},
    logoContainer: {
      marginRight: theme.spacing(2),
      cursor: 'pointer',
      flexGrow: 1,
    },
    logoImage: {
      width: 80
    },
    item: {
      borderRadius: 0,
      minWidth: 'unset',
      opacity: 0.6,
      fontSize: 14,
      fontFamily: 'ApercuPro',
      fontWeight: 'normal',
      marginLeft: theme.spacing(3)
    },
    signIn: {
      borderBottom: `2px solid ${theme.palette.buttonColor}`
    }
  };
};

const NavBar = ({
  classes, SignOffItems, AdminItems, ReferrerItems, WeakItems, ...props
}) => {
  const { user } = useSelector(state => state.auth, []);
  let items = [];

  if (hasValidToken()) {
    switch (user.role) {
      case roles.ADMIN_ROLE:
        items = AdminItems;
        break;
      case roles.REFERRER_ROLE:
        items = ReferrerItems;
        break;
      case roles.WEAK_ROLE:
        items = WeakItems;
        break;
      default:
        items = ReferrerItems;
        break;
    }
  } else {
    items = SignOffItems;
  }

  return (
    <AppBar
      position='fixed'
      className={classes.appBar}>
      <Toolbar
        disableGutters={true}
        className={classes.toolbar}>
        <Link
          to={'/'}
          className={classes.logoContainer}>
          <img
            src={LogoImage}
            className={classes.logoImage}
            alt='main logo' />
        </Link>
        {items.map((item, index) => (
          <Button
            key={index}
            href={item.url}
            className={classNames(classes.item, { [classes.signIn]: item.url === pageLinks.SignIn.url })}>
            {item.title}
          </Button>
        ))}
        {
          (hasValidToken && !!user) &&
          <ProfileDropdown
            {...props}
            avatar={user.avatar || defaultAvatarLink} />
        }
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array
};

NavBar.defaultProps = {
  SignOffItems: [
    {
      title: pageLinks.FAQ.title,
      url: pageLinks.FAQ.url
    },
    {
      title: pageLinks.SignIn.title,
      url: pageLinks.SignIn.url
    }
  ],
  AdminItems: [
    {
      title: pageLinks.AdminUserList.title,
      url: pageLinks.AdminUserList.url
    },
    {
      title: pageLinks.Discover.title,
      url: pageLinks.Discover.url
    },
    {
      title: pageLinks.FAQ.title,
      url: pageLinks.FAQ.url
    }
  ],
  ReferrerItems: [
    {
      title: pageLinks.Discover.title,
      url: pageLinks.Discover.url
    },
    {
      title: pageLinks.RecommendCount.title,
      url: pageLinks.RecommendCount.url
    },
    {
      title: pageLinks.FAQ.title,
      url: pageLinks.FAQ.url
    }
  ],
  WeakItems: [
    {
      title: pageLinks.RecommendCount.title,
      url: pageLinks.RecommendCount.url
    },
    {
      title: pageLinks.FAQ.title,
      url: pageLinks.FAQ.url
    }
  ]
};

export default connect()(withStyles(styles, { withTheme: true })(NavBar));
