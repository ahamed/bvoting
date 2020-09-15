import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
	const [expand, setExpand] = useState(false);
	const router = useRouter();

	return (
		<nav
			className='navbar is-black'
			role='navigation'
			aria-label='main navigation'
		>
			<div className={`navbar-brand`}>
				<Link href='/'>
					<a className='navbar-item'>
						<img src='/logo.png' alt='Site Logo' />
						<strong>SBVOTE</strong>
					</a>
				</Link>

				<a
					href='#'
					className={`navbar-burger burger ${
						expand ? 'is-active' : ''
					}`}
					onClick={() => setExpand(!expand)}
					aria-label='menu'
					aria-expanded='false'
					data-target='mainNavbar'
				>
					<span aria-hidden='true'></span>
					<span aria-hidden='true'></span>
					<span aria-hidden='true'></span>
				</a>
			</div>

			<div
				className={`navbar-menu ${expand ? 'is-active' : ''}`}
				id='mainNavbar'
			>
				<div className={`navbar-start`}>
					<Link href='/'>
						<a
							className={`navbar-item ${
								router.pathname == '/' ? 'is-active' : ''
							}`}
						>
							Home
						</a>
					</Link>
					<Link href='/voters'>
						<a
							className={`navbar-item ${
								router.pathname == '/voters' ? 'is-active' : ''
							}`}
						>
							Voters
						</a>
					</Link>
					<Link href='/candidates'>
						<a
							className={`navbar-item ${
								router.pathname == '/candidates'
									? 'is-active'
									: ''
							}`}
						>
							Candidates
						</a>
					</Link>
					<Link href='/vote'>
						<a
							className={`navbar-item ${
								router.pathname == '/vote' ? 'is-active' : ''
							}`}
						>
							Cast Vote
						</a>
					</Link>
					<Link href='/restricted'>
						<a
							className={`navbar-item ${
								router.pathname == '/restricted'
									? 'is-active'
									: ''
							}`}
						>
							EC
						</a>
					</Link>
				</div>

				<div className='navbar-end'>
					<div className='navbar-item has-dropdown is-hoverable'>
						<a href='#' className='navbar-link'>
							Registration
						</a>
						<div className='navbar-dropdown'>
							<Link href='/candidate-registration'>
								<a
									className={`navbar-item ${
										router.pathname ==
										'/candidate-registration'
											? 'is-active'
											: ''
									}`}
								>
									Candidate
								</a>
							</Link>
							<Link href='/registration'>
								<a
									className={`navbar-item ${
										router.pathname == '/registration'
											? 'is-active'
											: ''
									}`}
								>
									Voter
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
