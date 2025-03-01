import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../components/api/settings';

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async ({ userId }) => {
    const response = await axios.get(`${apiBaseUrl}/ticket/user/information/${userId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
});

export const generateTicket = createAsyncThunk(
    "ticket/generateTicket",
    async ({ ticketBody }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/ticket/generate`,
                ticketBody,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data
            );
        }
    }
);


const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: { data: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchTickets.rejected, (state) => { state.status = 'failed'; })
            .addCase(generateTicket.pending, (state) => { state.status = 'loading'; })
            .addCase(generateTicket.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(generateTicket.rejected, (state) => { state.status = 'failed'; });
    },
});

export default ticketsSlice.reducer;
