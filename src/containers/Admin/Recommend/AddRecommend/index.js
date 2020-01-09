
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import * as RECOMMEND_SERVICE from '../../../../services/recommend';
import {
  addEditRecommend,
  setExpertises,
  setRelationships,
  setUsers
} from '../../../../actions';
import { ControlButtons } from '../../Shared';
import { pageLinks } from '../../../../constants/links';
import notifications from '../../../../constants/notifications';
import {
  AccordionLayout,
  EditableLayout,
  ConfirmDialog,
  EditableInput,
  EditableSelect,
  EditableMultiSelect,
  EditableTextarea
} from '../../../../components';
import { showErrorToast, isEmpty } from '../../../../utils/utility';

const styles = theme => {
  return {
    root: {
      width: '100%',
      marginTop: theme.spacing(6)
    }
  };
};

const AdminAddRecommend = ({ classes, defaultRecommend, panel, history }) => {
  const users = useSelector(state => state.user.data, []);
  const expertises = useSelector(state => state.expertise.data, []);
  const relationships = useSelector(state => state.relationship.data, []);
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(panel);
  const [editPanel, setEditPanel] = useState(panel);
  const [showDialog, setShowDialog] = useState(false);
  const [recommend, setRecommend] = useState(defaultRecommend);
  const [expertiseOptions, setExpertiseOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [subExpertiseOptions, setSubExpertiseOptions] = useState([]);
  const [relationshipOptions, setRelationshipOptions] = useState([]);

  useEffect(() => {
    dispatch(setUsers());
    dispatch(setExpertises());
    dispatch(setRelationships());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const expertisesData = expertises.map(({ name }) => ({ label: name, value: name }));
    setExpertiseOptions(expertisesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expertises]);

  useEffect(() => {
    const relationshipsData = relationships.map(({ name }) => ({ label: name, value: name }));
    setRelationshipOptions(relationshipsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationships]);

  useEffect(() => {
    const selectedExpertise = expertises.find(expertise => expertise.name === recommend.expertiseArea);
    let subExpertisesData = []
    if (!isEmpty(selectedExpertise)) {
      subExpertisesData = selectedExpertise.subExpertises.map((name) => ({ label: name, value: name }));
    }
    setSubExpertiseOptions(subExpertisesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommend, expertises]);

  useEffect(() => {
    const data = users.map((user) => ({
      ...user,
      label: user.email,
      value: user.email
    }));
    setUserOptions(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const expandHandler = panel => {
    setExpanded(panel);
  };

  const editHandler = (panel) => {
    setEditPanel(panel);
  }

  const backHandler = () => {
    history.push(pageLinks.AdminRecommendList.url);
  }

  const onFieldChangeHandler = (name) => async (event) => {
    let data = {
      ...recommend,
      [name]: !!event.target ? event.target.value : event
    }

    if (name === 'expertiseArea') {
      data = {
        ...data,
        subExpertises: []
      }
    }
    setRecommend(data);
  }

  const onReferrerSelectHandler = () => async (event) => {
    const { value } = event.target;
    if (value === recommend.candidate.email) {
      showErrorToast(notifications.RECOMMEND_EMAIL_VALODATION_ERROR);
      return null;
    }
    const selectedUser = users.find((user) => (user.email === value));

    const data = {
      ...recommend,
      referrer: selectedUser
    }
    setRecommend(data);
  }

  const onCandidateChangeHandler = (name) => async (event) => {
    const { value } = event.target;
    if (name === 'email' && value === recommend.referrer.email) {
      showErrorToast(notifications.RECOMMEND_EMAIL_VALODATION_ERROR);
      return null;
    }

    const data = {
      ...recommend,
      candidate: {
        ...recommend.candidate,
        [name]: value
      }
    }
    setRecommend(data);
  }

  const saveHandler = async () => {
    if (!recommend.expertiseArea
      || !recommend.referrer.email
      || !recommend.candidate.email
      || !recommend.candidate.firstName
      || !recommend.candidate.lastName) {
      showErrorToast(notifications.ADD_RECOMMEND_VALODATION_ERROR);
      return null;
    }

    try {
      const { data } = await RECOMMEND_SERVICE.addRecommend(recommend);
      dispatch(addEditRecommend(data));
      history.push(pageLinks.AdminRecommendList.url);
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        showErrorToast(message);
      }
    }
  }

  const deleteHandler = async () => {
    setRecommend(defaultRecommend);
    setEditPanel(false);
    setShowDialog(false);
  }

  const openConfirmDialogHandler = () => {
    setShowDialog(true);
  }

  const closeDialogHandler = () => {
    setShowDialog(false);
  }

  const isEdit = panel === editPanel;
  return (
    <main className={classes.root}>
      <ControlButtons
        backLabel='back to all recommends'
        onBack={backHandler}
        onSave={saveHandler}
        onDelete={openConfirmDialogHandler}
      />
      <AccordionLayout
        title='Recommend'
        panel={panel}
        onExpand={expandHandler}
        selectedPanel={expanded}>
        <EditableLayout
          panel={panel}
          isEdit={isEdit}
          onEdit={editHandler}>
          <EditableSelect
            isEdit={isEdit}
            label='Referrer email*'
            placeholder='Select Referrer email'
            options={userOptions}
            value={recommend.referrer.email}
            onChange={onReferrerSelectHandler()}
          />
          <EditableInput
            isEdit={false}
            label='First Name'
            value={recommend.referrer.firstName}
          />
          <EditableInput
            isEdit={false}
            label='Last Name'
            value={recommend.referrer.lastName}
          />
          <EditableInput
            isEdit={isEdit}
            label='Candidate email*'
            value={recommend.candidate.email}
            onChange={onCandidateChangeHandler('email')}
          />
          <EditableInput
            isEdit={isEdit}
            label='First Name*'
            value={recommend.candidate.firstName}
            onChange={onCandidateChangeHandler('firstName')}
          />
          <EditableInput
            isEdit={isEdit}
            label='Last Name*'
            value={recommend.candidate.lastName}
            onChange={onCandidateChangeHandler('lastName')}
          />
          <EditableSelect
            isEdit={isEdit}
            label='Expertise area*'
            placeholder='Select expertise area'
            options={expertiseOptions}
            value={recommend.expertiseArea}
            onChange={onFieldChangeHandler('expertiseArea')}
          />
          <EditableMultiSelect
            isEdit={isEdit}
            label='Expertise area detail'
            placeholder='Select expertise area detail'
            options={subExpertiseOptions}
            value={recommend.subExpertises}
            onChange={onFieldChangeHandler('subExpertises')}
          />
          <EditableSelect
            isEdit={isEdit}
            label='Relationship'
            placeholder='Select relationship'
            options={relationshipOptions}
            value={recommend.whichCapacity}
            onChange={onFieldChangeHandler('whichCapacity')}
          />
          <EditableTextarea
            isEdit={isEdit}
            label='Relationship detail'
            value={recommend.howYouKnow}
            onChange={onFieldChangeHandler('howYouKnow')}
          />
          <EditableTextarea
            rows={4}
            isEdit={isEdit}
            label='Why great'
            value={recommend.whyGreat}
            onChange={onFieldChangeHandler('whyGreat')}
          />
        </EditableLayout>
      </AccordionLayout>
      {
        showDialog &&
        <ConfirmDialog
          opened={showDialog}
          onClose={closeDialogHandler}
          onConfirm={deleteHandler} />
      }
    </main>
  );
};

AdminAddRecommend.defaultProps = {
  panel: 'recommendPanel'
};

AdminAddRecommend.defaultProps = {
  defaultRecommend: {
    referrer: {},
    candidate: {}
  }
};

export default withStyles(styles)(AdminAddRecommend);
