import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [],
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addNewGroup: (state, action) => {
      state.groups.push(action.payload);
    },
  },
});

export const { setGroups, addNewGroup } = groupSlice.actions;

export default groupSlice.reducer;
