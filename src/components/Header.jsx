import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>Demo Restaurant</Link>
            <nav className={styles.nav}>
                <Link to="/" className={styles.navLink}>Inicio</Link>
                <Link to="/reservar" className={styles.navLink}>Reservas</Link>
                <span className={styles.navLink} style={{ cursor: 'not-allowed', opacity: 0.5 }}>Contacto</span>
            </nav>
            <button className={styles.ctaButton} onClick={() => navigate('/reservar')}>
                HAZ TU RESERVA
            </button>
        </header>
    );
};

export default Header;
