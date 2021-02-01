import Head from 'next/head';
import Layout from '../components/layout/layout';
import styles from './index.module.scss';

const Home = () => {
	return (
		<Layout>
			<Head>
				<title>Home Page</title>
			</Head>
			<div className="columns">
				<div className="column">
					<div className="box has-text-centered text-success">
						<p>Vote casted successfully! Your vote ID is <code>3633980571</code>. You can check your vote by using this ID after the vote counting finished.</p>
					</div>
				</div>
				<div className="column"></div>
			</div>
			{/* <div className={styles['voting-home']}>
				<div className='columns'>
					<div className='column is-4'>
						<img src='/vote2.png' alt='voting' />
						<img
							src='/chain.png'
							alt='chain'
							className={styles['chain-img']}
						/>
					</div>
					<div className='column is-8'>
						<h1 className='title'>
							Sidechain based digital voting.
						</h1>
						<p>
							Democracy which implies citizens have the right to
							select their representatives. Voting is asignificant
							procedure for people to settle on their own leader
							for the government [1]. Fairness,independence, and
							unbiasedness should be present in the voting system.
							Hence, it must bea transparent and secured process
							so that everybody can express their own opinion
							freely [1]A large portion of people in the world
							does not keep faith in the election system [2].
							Thetraditional voting process is centralized and
							crowded with intermediaries [3]. Furthermore,people
							are facing many problems like Booth capturing [2],
							long queue in front of votingbooths, false vote,
							pre-vote, casting redundant vote lack of law
							enforcement and audits,political instability, lack
							of awareness, voting booths are far away from
							residence and seniorcitizens are facing major
							issues, which decreases voting percentage [4].Though
							EVM (Electronic Voting Machine) comes with the
							solution of the problems whichare raised in the
							traditional voting system. Nonetheless, EVM still
							suffers from universalacceptance issues as it fails
							to handle some security problems. The most important
							issuewith EVM is using a centralized database as it
							is easy to insert some malware into themachine which
							would tamper the database [5].Another type of voting
							is Digital voting which is the use of electronic
							devices to cast votesand currently there are two
							ways of voting digitally : E-voting and I-voting.
							E-voting iswhen voters use a machine at the polling
							station to cast their votes and I-voting is when
							aweb browser is used for this purpose [6]. Electoral
							voting systems allow voters to vote atany location
							without geographical restrictions all over the world
							which considers mobility,privacy, security, and ease
							[7]
						</p>
					</div>
				</div>
			</div> */}
		</Layout>
	);
};

export default Home;
