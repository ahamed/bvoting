import Head from 'next/head';
import Layout from '../components/layout/layout';

const Home = () => {
	return (
		<Layout>
			<Head>
				<title>Home Page</title>
			</Head>

			<div className='body'>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Blanditiis ab illum dolorem itaque in fugiat ex voluptatem,
					iure maiores veniam porro temporibus excepturi reiciendis
					sint! Saepe illo aspernatur ipsam ad!
				</p>
			</div>
		</Layout>
	);
};

export default Home;
