import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  cursor: "",
  likedProjects: [],
  trendingProjects: [],
  totalProjects: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setprojects: (state, action) => {
      state.projects = action.payload.projects;
      state.totalProjects = action.payload.totalProjects;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    },
    setLikedProjects: (state, action) => {
      state.projects = state.projects.map((project) => {
        if (project._id === action.payload._id) {
          project.likeCount = project.alreadyLiked
            ? Math.max(0, project.likeCount - 1)
            : project.likeCount + 1;
          project.alreadyLiked = project.alreadyLiked ? 0 : 1;
        }
        return project; // Return each portfolio, modified or not
      });
    },
    setTrendingProjects: (state, action) => {
      state.trendingProjects = action.payload;
    },
    incrementViewCountOfProjects: (state, action) => {
      state.projects = state.projects.map((project) => {
        if (project._id === action.payload._id) {
          project.views += 1;
          return project;
        }
        return project;
      });
    },
  },
});

export const {
  setprojects,
  setLikedProjects,
  setTrendingProjects,
  incrementViewCountOfProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
