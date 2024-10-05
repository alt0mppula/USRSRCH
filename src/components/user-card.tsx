import { User } from '../types';
import styles from '../user-card.module.css';

interface UserCardProps {
	user: User;
}

const UserCard = ({ user }: UserCardProps) => {
	return (
		<li className={styles.card}>
			<h2>{user.name}</h2>

			<p>
				<a href={`mailto:${user.email}`}>{user.email}</a>
			</p>

			<p>
				<a href={`tel:${user.phone}`}>{user.phone}</a>
			</p>

			<p>
				<a rel="noreferrer noopener" target="_blank" href={user.website}>
					{user.website}
				</a>
			</p>

			<p>
				{user.address.street}, {user.address.suite}, {user.address.city},{' '}
				{user.address.zipcode}
			</p>
		</li>
	);
};

export default UserCard;
