import userActionTypes from './user.types';

const { HANDLE_INPUT_CHANGE, GET_USER_INFO } = userActionTypes;

export const handleInputChange = (name, value) => ({
	type: HANDLE_INPUT_CHANGE,
	payload: { name, value },
});
