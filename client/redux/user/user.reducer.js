import userActionTypes from './user.types';
const INITIAL_STATE = {
	name: '',
	secret: '',
	mobile: '',
	nid: '',
	region: '',
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
