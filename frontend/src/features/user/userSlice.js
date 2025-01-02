import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logedInUser: null,
  isAuthenticated: false,
  portfolio: {},
  projects: [],
  submittedProjects: [],
  receivedProjects: [],
  cursor: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.logedInUser = action.payload;
      state.isAuthenticated = true;
    },
    setUserPortfolio: (state, action) => {
      state.portfolio = { ...action.payload };
      state.cursor = action.payload.nextCursor || "";
    },
    setUserProjects: (state, action) => {
      state.projects = action.payload;
    },
    updateUserProjectAfterDelete: (state, action) => {
      const updatedProjects = state.projects.filter(
        (project) => project._id !== action.payload._id
      );
      state.projects = updatedProjects;
    },
    setUserSubmittedProjects: (state, action) => {
      state.submittedProjects = action.payload;
    },
    addProjectToSubmittedProjects: (state, action) => {
      state.submittedProjects = [action.payload, ...state.submittedProjects];
    },
    setUserReceiverProjects: (state, action) => {
      state.receivedProjects = action.payload;
    },
  },
});

export const {
  setUser,
  setUserPortfolio,
  setUserProjects,
  updateUserProjectAfterDelete,
  setUserSubmittedProjects,
  addProjectToSubmittedProjects,
  setUserReceiverProjects,
} = userSlice.actions;

export default userSlice.reducer;
