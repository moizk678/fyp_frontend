import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userEmail: null,
  userPassword: null,
  userName: null, // Include name for signup
  userPhone: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loginUser: (state, action) => {
      state.userEmail = action.payload.userEmail;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    signUpUser: (state, action) => {
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.userId = action.payload.userId;
      state.userPhone=action.payload.userPhone;
      state.isLoggedIn = true; // Automatically logged in after signup
    },
    logoutUser: (state) => {
      state.userName = null;
      state.userEmail = null;
      state.userPassword = null;
      state.userPhone=null;
      state.userId = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, signUpUser, logoutUser } = userSlice.actions;

export const selectUserEmail = (state) => state.user.userEmail;
export const selectUserPassword = (state) => state.user.userPassword;
export const selectUserId = (state) => state.user.userId;
export const selectUserName = (state) => state.user.userName; // Selector for userName
export const selectUserPhone = (state) => state.user.userPhone; // Selector for userName
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;