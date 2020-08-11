import { Provider, connect } from 'react-redux';
import { useEffect, useState } from 'react';
import getWeb3 from '../getWeb3';
import { store } from '../redux/store';

import { instantiateWeb3 } from '../redux/web3/web3.actions';

import 'bulma/css/bulma.css';
import '../App.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

const Wrapper = ({ Component, pageProps, instantiateWeb3 }) => {
	useEffect(() => {
		instantiateWeb3();
	}, []);

	return <Component {...pageProps} />;
};
const mapDispatchToProps = dispatch => ({
	instantiateWeb3: () => dispatch(instantiateWeb3()),
});
const WrapperWithRedux = connect(null, mapDispatchToProps)(Wrapper);

const App = ({ Component, pageProps }) => {
	return (
		<Provider store={store}>
			<WrapperWithRedux Component={Component} pageProps={pageProps} />
		</Provider>
	);
};

export default App;
