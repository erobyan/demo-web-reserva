import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
    step: 1,
    people: 2,
    date: null,
    time: null,
    name: '',
    email: '',
    phone: '',
    zone: 'Sala', // 'Sala' | 'Terraza'
    notes: '',
    bookingId: null,
};

const bookingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'NEXT_STEP':
            return { ...state, step: state.step + 1 };
        case 'PREV_STEP':
            return { ...state, step: Math.max(1, state.step - 1) };
        case 'SET_STEP':
            return { ...state, step: action.step };
        case 'RESET_BOOKING':
            return initialState;
        default:
            return state;
    }
};

export const BookingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    const setField = (field, value) => dispatch({ type: 'SET_FIELD', field, value });
    const nextStep = () => dispatch({ type: 'NEXT_STEP' });
    const prevStep = () => dispatch({ type: 'PREV_STEP' });
    const setStep = (step) => dispatch({ type: 'SET_STEP', step });
    const resetBooking = () => dispatch({ type: 'RESET_BOOKING' });

    return (
        <BookingContext.Provider value={{ state, setField, nextStep, prevStep, setStep, resetBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
