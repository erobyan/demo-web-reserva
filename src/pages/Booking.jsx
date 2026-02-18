import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { getAvailability, createBooking, getReservationMetadata } from '../api/bookingApi';
import styles from './Booking.module.css';

const STEPS = ["Encontrar", "Información", "Adicional", "Confirmación"];

const Booking = () => {
    const { state, setField, nextStep, prevStep, setStep, resetBooking } = useBooking();
    const navigate = useNavigate();
    const [availability, setAvailability] = useState({ lunch: [], dinner: [] });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [maxDays, setMaxDays] = useState(15);
    const [metadata, setMetadata] = useState(null);
    const scrollContainerRef = useRef(null);

    // Scroll 200px
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Load metadata on mount
    useEffect(() => {
        getReservationMetadata()
            .then(data => {
                setMetadata(data);
                if (data.latestBookingDays) {
                    setMaxDays(data.latestBookingDays);
                }
            })
            .catch(err => console.error("Failed to load metadata", err));
    }, []);

    // Load availability when Date/People changes (for Step 1)
    useEffect(() => {
        if (state.date && state.people) {
            setLoading(true);
            setField('time', null); // Reset time when date/people changes
            getAvailability(state.date, state.people)
                .then(data => {
                    const options = data.options || [];
                    const lunch = options.filter(opt => parseInt(opt.start.split(':')[0]) < 17).map(opt => opt.start);
                    const dinner = options.filter(opt => parseInt(opt.start.split(':')[0]) >= 17).map(opt => opt.start);

                    setAvailability({ lunch, dinner, originalOptions: options });
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load availability", err);
                    setLoading(false);
                });
        }
    }, [state.date, state.people]);
    // Initialize date if empty
    useEffect(() => {
        if (!state.date) {
            const today = new Date().toISOString().split('T')[0];
            setField('date', today);
        }
    }, []);

    const handleDateSelect = (dateStr) => {
        setField('date', dateStr);
        setField('time', null); // Reset time when date changes
    };

    const generateDateChips = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < maxDays; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
            dates.push({ dateStr, dayName });
        }
        return dates;
    };

    const handleNext = () => {
        if (state.step === 3) {
            handleSubmit();
        } else {
            nextStep();
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                date: state.date,
                start: state.time,
                people: state.people,
                location: state.zone,
                customer: {
                    name: state.name,
                    email: state.email,
                    phone: state.phone,
                },
                notes: state.notes
            };

            const result = await createBooking(payload);
            if (result.success) {
                navigate('/confirmacion');
            }
        } catch (error) {
            console.error("Booking error", error);
        } finally {
            setSubmitting(false);
        }
    };

    const isStep1Valid = state.people && state.date && state.time;
    const isStep2Valid = state.name && state.email && state.phone;
    const isStep3Valid = state.zone;

    const canProceed = () => {
        if (state.step === 1) return isStep1Valid;
        if (state.step === 2) return isStep2Valid;
        if (state.step === 3) return isStep3Valid;
        return false;
    };

    const getMaxPeople = () => {
        return metadata?.reservationModel?.maxPeoplePerReservation || 10;
    };

    const getDayNote = () => {
        if (!metadata || !metadata.schedule || !state.date) return null;
        return metadata.schedule[state.date]?.notes || null;
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>DEMO RESTAURANT</h2>

                {/* Steps Indicator */}
                <div className={styles.stepsContainer}>
                    {STEPS.map((label, idx) => {
                        const stepNum = idx + 1;
                        let stepClass = styles.step;
                        if (state.step === stepNum) stepClass += ` ${styles.stepActive}`;
                        else if (state.step > stepNum) stepClass += ` ${styles.stepFinished}`;

                        return (
                            <div key={label} className={stepClass}>
                                <div className={styles.stepCircle}>{state.step > stepNum ? '✓' : stepNum}</div>
                                <span>{label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Step 1: Find Table */}
                {/* Step 1: Find Table */}
                {state.step === 1 && (
                    <div className="animation-fade-in">
                        <div className={styles.row}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <label className={styles.label}>Personas</label>
                                <select
                                    className={styles.select}
                                    value={state.people}
                                    onChange={(e) => setField('people', Number(e.target.value))}
                                >
                                    {[...Array(getMaxPeople())].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1} Personas</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 2, minWidth: 0 }}>
                                <label className={styles.label}>Fecha</label>
                                <div className={styles.dateScrollWrapper}>
                                    <button
                                        type="button"
                                        className={styles.scrollBtn}
                                        onClick={() => scroll('left')}
                                        aria-label="Previous dates"
                                    >
                                        ←
                                    </button>
                                    <div className={styles.dateChips} ref={scrollContainerRef}>
                                        {generateDateChips().map(({ dateStr, dayName }) => (
                                            <button
                                                key={dateStr}
                                                className={`${styles.chip} ${state.date === dateStr ? styles.chipSelected : ''}`}
                                                onClick={() => handleDateSelect(dateStr)}
                                            >
                                                {dayName}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.scrollBtn}
                                        onClick={() => scroll('right')}
                                        aria-label="Next dates"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {getDayNote() && (
                            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                                ⚠️ {getDayNote()}
                            </div>
                        )}

                        {loading ? <p>Cargando disponibilidad...</p> : (
                            <>
                                <h3 className={styles.sectionTitle}>COMIDA</h3>
                                <div className={styles.timeGrid}>
                                    {availability.lunch.length > 0 ? availability.lunch.map(time => (
                                        <button
                                            key={time}
                                            className={`${styles.timeBtn} ${state.time === time ? styles.timeBtnSelected : ''}`}
                                            onClick={() => {
                                                setField('time', time);
                                                setField('zone', null);
                                            }}
                                        >
                                            {time}
                                        </button>
                                    )) : <p style={{ fontSize: '0.9rem', color: '#999' }}>No hay horas disponibles</p>}
                                </div>

                                <h3 className={styles.sectionTitle}>CENA</h3>
                                <div className={styles.timeGrid}>
                                    {availability.dinner.length > 0 ? availability.dinner.map(time => (
                                        <button
                                            key={time}
                                            className={`${styles.timeBtn} ${state.time === time ? styles.timeBtnSelected : ''}`}
                                            onClick={() => {
                                                setField('time', time);
                                                setField('zone', null);
                                            }}
                                        >
                                            {time}
                                        </button>
                                    )) : <p style={{ fontSize: '0.9rem', color: '#999' }}>No hay horas disponibles</p>}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 2: User Info */}
                {state.step === 2 && (
                    <div className="animation-fade-in">
                        <div className={styles.row}>
                            <div style={{ flex: 1 }}>
                                <label className={styles.label}>Nombre</label>
                                <input
                                    className={styles.input}
                                    value={state.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className={styles.label}>Apellidos</label>
                                <input
                                    className={styles.input}
                                    placeholder="Tus apellidos"
                                />
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div style={{ flex: 1 }}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    value={state.email}
                                    onChange={(e) => setField('email', e.target.value)}
                                    placeholder="ejemplo@email.com"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className={styles.label}>Teléfono</label>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    value={state.phone}
                                    onChange={(e) => setField('phone', e.target.value)}
                                    placeholder="+34 600 000 000"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Additional Info */}
                {state.step === 3 && (
                    <div className="animation-fade-in">
                        <h3 className={styles.sectionTitle}>Selecciona Zona</h3>
                        <div className={styles.zoneGrid}>
                            {availability.originalOptions
                                ? availability.originalOptions.find(opt => opt.start === state.time)?.locations.map(loc => (
                                    <button
                                        key={loc}
                                        className={`${styles.zoneBtn} ${state.zone === loc ? styles.zoneBtnSelected : ''}`}
                                        onClick={() => setField('zone', loc)}
                                    >
                                        {loc === 'Sala' ? '🏠 Sala' : (loc === 'Terraza' ? '🌿 Terraza' : loc)}
                                    </button>
                                ))
                                : (
                                    <p>No hay zonas disponibles para esta hora.</p>
                                )
                            }
                        </div>

                        <label className={styles.label}>Notas especiales (opcional)</label>
                        <textarea
                            className={styles.textarea}
                            rows={4}
                            value={state.notes}
                            onChange={(e) => setField('notes', e.target.value)}
                            placeholder="Alergias, ocasiones especiales..."
                        />
                    </div>
                )}

                {/* Navigation */}
                <div className={styles.actions}>
                    {state.step > 1 && (
                        <button className={styles.btnSecondary} onClick={prevStep}>
                            Volver
                        </button>
                    )}

                    <button
                        className={styles.btnPrimary}
                        onClick={handleNext}
                        disabled={!canProceed() || submitting}
                    >
                        {submitting ? 'Confirmando...' : (state.step === 3 ? 'Confirmar Reserva' : 'Continuar')}
                    </button>
                </div>

            </div>
        </div >
    );
};

export default Booking;
