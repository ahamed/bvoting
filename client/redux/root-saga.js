import { all, call } from 'redux-saga/effects';

import { web3Saga } from './web3/web3.saga';

export default function* rootSaga() {
	yield all([call(web3Saga)]);
}
