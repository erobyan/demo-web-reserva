import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>DEMO RESTAURANT</h1>
                <p className={styles.subtitle}>
                    Esta es una demostración técnica para probar el flujo de reservas online.
                    Experimenta nuestro sistema de gestión simple y elegante.
                </p>
                <button className={styles.ctaButton} onClick={() => navigate('/reservar')}>
                    HAZ TU RESERVA
                </button>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Nuestra Esencia</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Cocina de Autor</h3>
                        <p>Sabores únicos creados con pasión y productos de temporada.</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Espacio Único</h3>
                        <p>Diseño minimalista pensado para tu confort y tranquilidad.</p>
                    </div>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Ubicación</h3>
                        <p>En el corazón de la ciudad tecnológica.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
