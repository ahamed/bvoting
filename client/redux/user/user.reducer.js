import userActionTypes from './user.types';
const INITIAL_STATE = {
	firstName: '',
	lastName: '',
	email: '',
	mobile: '',
	nid: '',
};

const { HANDLE_INPUT_CHANGE } = userActionTypes;

const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case HANDLE_INPUT_CHANGE:
			return { ...state, [action.payload.name]: action.payload.value };
		default:
			return state;
	}
};

export default userReducer;
