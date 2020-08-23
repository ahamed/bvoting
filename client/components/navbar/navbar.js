import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
	const [expand, setExpand] = useState(false);
	const router = useRouter();

	return (
		<nav
			className='navbar is-danger'
			role='navigation'
			aria-label='main navigation'
		>
			<div className={`navbar-brand`}>
				<Link href='/'>
					<a className='navbar-item'>
						<img src='/logo.svg' alt='Site Logo' />
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
				</div>

				<div className='navbar-end'>
					<Link href='/candidate'>
						<a
							className={`navbar-item ${
								router.pathname == '/candidate'
									? 'is-active'
									: ''
							}`}
						>
							Candidate Registration
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
							Registration
						</a>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
