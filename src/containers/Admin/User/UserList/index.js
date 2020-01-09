
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Paper } from '@material-ui/core';
import VerifyIcon from '@material-ui/icons/Link';
import UnVerifyIcon from '@material-ui/icons/LinkOff';

import { AdminTabs } from '../../Shared';
import { setUsers, removeUser, addEditUser } from '../../../../actions';
import * as USER_SERVICE from '../../../../services/user';
import {
  CustomMUIDataTable,
  EditIconButton,
  RemoveIconButton,
  PrimaryButton,
  ConfirmDialog,
  CustomChip,
  CustomSwitchButton
} from '../../../../components';
import { commonMUITableOptions } from '../../../../utils/styles';
import { pageLinks } from '../../../../constants/links';
import { showErrorToast } from '../../../../utils/utility';

const styles = theme => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      margin: `${theme.spacing(4)}px 0`
    },
    paper: {
      margin: `${theme.spacing(2)}px 0`
    },
    actions: {
      display: 'flex'
    },
    addButton: {
      color: theme.palette.subButtonColor,
      backgroundColor: theme.palette.subBackColor4,
      boxShadow: `0px 2px 2px rgba(0, 0, 0, 0.24), 0px 0px 2px rgba(0, 0, 0, 0.12)`,
    }
  };
};

const AdminUserList = ({ classes, history }) => {
  const users = useSelector(state => state.user.data, []);
  const dispatch = useDispatch();

  const [showDialog, setShowDialog] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    dispatch(setUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTableData = users => {
    const tableData = users.map(user => {
      const { firstName, lastName, email, verified, _id, recommends } = user;
      let approveRecommend = 0, unAprroveRecommend = 0;
      recommends.map((recommend) => (
        recommend.verified ? approveRecommend++ : unAprroveRecommend++
      ));

      const row = [
        firstName,
        lastName,
        email,
        `${approveRecommend} / ${unAprroveRecommend}`,
        verified,
        _id
      ];
      return row;
    });
    return tableData;
  };

  const columns = () => [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Email' },
    { name: '#' },
    {
      name: 'Access',
      options: {
        customBodyRender: value => {
          const labels = ['Verified', 'Unverified'];
          return (
            <CustomChip flag={value} labels={labels} />
          );
        }
      }
    },
    {
      name: 'Action',
      options: {
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const user = users.find(user => user._id === value);

          return (
            <div className={classes.actions}>
              <CustomSwitchButton
                flag={user.verified}
                trueIcon={<VerifyIcon />}
                falseIcon={<UnVerifyIcon />}
                onClick={verifyUserHandler(value)} />
              <EditIconButton
                onClick={editButtonHandler(value)} />
              <RemoveIconButton
                onClick={openConfirmDialogHandler(true, value)} />
            </div>
          );
        }
      }
    }
  ];

  const options = {
    ...commonMUITableOptions,
    customToolbar: () => {
      return (
        <PrimaryButton
          className={classes.addButton}
          onClick={addButtonHandler}>
          Add User
        </PrimaryButton>
      );
    }
  };

  const editButtonHandler = (userId) => () => {
    history.push(pageLinks.AdminEditUser.url.replace(':userId', userId));
  };

  const addButtonHandler = () => {
    history.push(pageLinks.AdminAddUser.url);
  }

  const openConfirmDialogHandler = (opened, removeId) => () => {
    setUserId(removeId);
    setShowDialog(opened);
  }

  const closeDialogHandler = () => {
    setUserId(null);
    setShowDialog(false);
  }

  const confirmDialogHandler = async () => {
    try {
      const { data } = await USER_SERVICE.removeUser(userId);
      dispatch(removeUser(data));
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        showErrorToast(message);
      }
    }
    setUserId(null);
    setShowDialog(false);
  }

  const verifyUserHandler = (userId) => async () => {
    try {
      const response = await USER_SERVICE.verifyUser(userId);
      const { data } = response;
      dispatch(addEditUser(data));
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        showErrorToast(message);
      }
    }
  };

  return (
    <main className={classes.root}>
      <AdminTabs selectedValue='users' history={history} />
      <Paper className={classes.paper}>
        <CustomMUIDataTable
          data={createTableData(users)}
          columns={columns()}
          options={options} />
      </Paper>
      <ConfirmDialog
        opened={showDialog}
        onClose={closeDialogHandler}
        onConfirm={confirmDialogHandler} />
    </main>
  );
};

AdminUserList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminUserList);
