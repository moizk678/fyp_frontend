import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userId: null,
  userEmail: null,
  userPassword: null,
  isLoggedIn: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loginUser: (state, action) => {
      state.userEmail = action.payload.userName;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logoutUser: (state, action) => {
      state.userEmail = null;
      state.userPassword = null;
      state.userId = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export const selectUserEmail = (state) => state.user.userEmail;
export const selectUserPassword = (state) => state.user.userPassword;
export const selectUserId = (state) => state.user.userId;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;



