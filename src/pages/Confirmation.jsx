import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import styles from './Confirmation.module.css';

const Confirmation = () => {
    const { state, resetBooking } = useBooking();
    const navigate = useNavigate();

    const handleHome = () => {
        resetBooking();
        navigate('/');
    };

    if (!state.date && !state.people) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p>No hay reserva reciente.</p>
                    <button className={styles.btn} onClick={() => navigate('/')}>Volver</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>✓</div>
                <h1 className={styles.title}>Reserva Confirmada</h1>

                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Fecha</span>
                        <span className={styles.value}>{state.date}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Hora</span>
                        <span className={styles.value}>{state.time}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Personas</span>
                        <span className={styles.value}>{state.people}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Zona</span>
                        <span className={styles.value}>{state.zone}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Nombre</span>
                        <span className={styles.value}>{state.name}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Dirección</span>
                        <span className={styles.value}>Calle Falsa 123</span>
                    </div>
                </div>

                <p className={styles.message}>
                    Recibirás en breve un email de confirmación a <strong>{state.email}</strong>
                </p>

                <button className={styles.btn} onClick={handleHome}>
                    Volver al inicio
                </button>
            </div>
        </div>
    );
};

export default Confirmation;
