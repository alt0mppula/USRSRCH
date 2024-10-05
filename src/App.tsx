import { useEffect, useMemo, useState } from 'react';
import { User } from './types';
import UserCard from './components/user-card';
import styles from './dashboard.module.css';
import UserCardSkeleton from './components/user-card-skeleton';

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [users, setUsers] = useState<User[] | null>(null);
	const [query, setQuery] = useState('');
	const [internalQuery, setInternalQuery] = useState('');
	const [sortByName, setSortByName] = useState<'asc' | 'desc'>('asc');
	const [sortByEmail, setSortByEmail] = useState<'asc' | 'desc'>('asc');
	const [activeSort, setActiveSort] = useState<'name' | 'email'>('name');

	useEffect(() => {
		try {
			setIsLoading(true);

			fetch('https://jsonplaceholder.typicode.com/users')
				.then((res) => res.json())
				.then((data) => {
					setUsers(data);
					setIsLoading(false);
				});
		} catch (error) {
			setIsError(true);
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setInternalQuery(query);
		}, 300);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [query]);

	const filteredUsers = useMemo(() => {
		// Filter users based on the internal query
		const filtered = [...(users || [])].filter((user) => {
			const queryLowerCase = internalQuery.toLowerCase();

			return (
				user.name.toLowerCase().includes(queryLowerCase) ||
				user.email.toLowerCase().includes(queryLowerCase) ||
				user.phone.toLowerCase().includes(queryLowerCase) ||
				user.website.toLowerCase().includes(queryLowerCase) ||
				`${user.address.street} ${user.address.suite} ${user.address.city} ${user.address.zipcode}`
					.toLowerCase()
					.includes(queryLowerCase)
			);
		});

		// Sorting logic for name
		if (activeSort === 'name') {
			filtered.sort((a, b) => {
				return sortByName === 'asc'
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name);
			});
		}

		// Sorting logic for email
		if (activeSort === 'email') {
			filtered.sort((a, b) => {
				return sortByEmail === 'asc'
					? a.email.localeCompare(b.email)
					: b.email.localeCompare(a.email);
			});
		}

		return filtered;
	}, [users, internalQuery, sortByName, sortByEmail]);

	const handleSortByName = () => {
		// When sorting by name, toggle the sort order
		setSortByName((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		// Reset the email sort order to its default
		setSortByEmail('asc');
		setActiveSort('name');
	};

	const handleSortByEmail = () => {
		// When sorting by email, toggle the sort order
		setSortByEmail((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		// Reset the name sort order to its default
		setSortByName('asc');
		setActiveSort('email');
	};

	return (
		<main>
			<div className={styles.toolbar}>
				<input
					type="search"
					placeholder="Search by name, email, phone, website, or address..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>

				<div>
					<button className={styles.button} onClick={handleSortByName}>
						Name {sortByName === 'asc' ? '🔼' : '🔽'}
					</button>
					<button className={styles.button} onClick={handleSortByEmail}>
						Email {sortByEmail === 'asc' ? '🔼' : '🔽'}
					</button>
				</div>
			</div>

			{isError && <p>Something went wrong!</p>}

			<ul className={styles.container}>
				{isLoading &&
					Array.from({ length: 6 }, (_, index) => <UserCardSkeleton key={index} />)}

				{filteredUsers &&
					filteredUsers.map((user) => <UserCard key={user.id} user={user} />)}
			</ul>
		</main>
	);
}

export default App;
