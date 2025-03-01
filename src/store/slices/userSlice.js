import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async ({ apiBaseUrl, userId }) => {
    const response = await axios.get(`${apiBaseUrl}/user/${userId}`);
    return response.data.user;
});

export const updateUserData = createAsyncThunk(
    'user/updateUserData',
    async ({ apiBaseUrl, userId, updatedFields }) => {
        const response = await axios.patch(`${apiBaseUrl}/user/update-profile`, {
            userId,
            ...updatedFields,
        });
        return response.data.user;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: { data: null, status: 'idle', userId: null },
    reducers: {
        setUserId(state, action) {
            state.userId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state) => { state.status = 'failed'; })

            // Handle update user data
            .addCase(updateUserData.pending, (state) => { state.status = 'loading'; })
            .addCase(updateUserData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(updateUserData.rejected, (state) => { state.status = 'failed'; });
    },
});

export const { setUserId } = userSlice.actions;
export default userSlice.reducer;
