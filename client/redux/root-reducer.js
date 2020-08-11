import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import web3Reducer from './web3/web3.reducer';

const rootReducer = combineReducers({
	user: userReducer,
	web3: web3Reducer,
});

export default rootReducer;
