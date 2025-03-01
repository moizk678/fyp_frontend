import { jwtDecode } from 'jwt-decode';
import { setUserId } from './slices/userSlice';
import { fetchBuses } from './slices/busesSlice';
import { fetchCompanies } from './slices/companiesSlice';
import { fetchUser } from './slices/userSlice';
import { fetchTickets } from './slices/ticketsSlice';

export const initializeStore = async (dispatch, apiBaseUrl) => {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        dispatch(setUserId(userId));
        await Promise.all([
            dispatch(fetchBuses(apiBaseUrl)).unwrap(),
            dispatch(fetchCompanies(apiBaseUrl)).unwrap(),
            dispatch(fetchUser({ apiBaseUrl, userId })).unwrap(),
            dispatch(fetchTickets({ userId })).unwrap(),
        ]);
    } catch (error) {
        console.error('Error initializing store:', error);
    }
};
