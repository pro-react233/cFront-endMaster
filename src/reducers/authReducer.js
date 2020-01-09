
import { REHYDRATE } from 'redux-persist'

import { isEmpty } from '../utils/utility'
import setAuthToken from '../services/security/setAuthToken'
import { jwtTokenKey } from '../constants/links'
import AuthConstants from '../constants/reducerConstants/AuthConstants'

const initialState = {
    isAuthenticated: false,
    user: {},
    profile: {},
    recommend: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REHYDRATE: {
            const token = localStorage.getItem(jwtTokenKey);
            setAuthToken(token);
            return state;
        }
        case AuthConstants.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case AuthConstants.EDIT_CURRENT_USER_INFO: {
            const newUser = { ...state.user, ...action.payload };
            return {
                ...state,
                user: newUser
            };
        }
        case AuthConstants.SET_CURRENT_PROFILE:
            return {
                ...state,
                profile: action.payload
            };
        case AuthConstants.SET_CURRENT_USER_RECOMMEND:
            return {
                ...state,
                recommend: action.payload
            };
        default:
            return state;
    }
}
