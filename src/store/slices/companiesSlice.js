import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async (apiBaseUrl) => {
    const response = await axios.get(`${apiBaseUrl}/admin/companies-information`);
    return response.data;
});

const companiesSlice = createSlice({
    name: 'companies',
    initialState: { data: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state) => { state.status = 'failed'; });
    },
});

export default companiesSlice.reducer;
