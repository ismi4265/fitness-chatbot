import UserProfileForm from '../components/UserProfileForm';
import styles from '../styles/Theme.module.css';

export default function Profile({ userId }) {
  return (
    <div className={styles.pageWrapper}>
      <UserProfileForm userId={userId} />
    </div>
  );
}
