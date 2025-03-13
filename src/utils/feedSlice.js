import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    profiles: [],
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFeedProfiles: (state, action) => {
      // If we receive less profiles than the limit, we know there are no more
      if (action.payload.length < 10) {
        state.hasMore = false;
      }
      // Merge new profiles with existing ones, avoiding duplicates
      const existingIds = state.profiles.map((profile) => profile._id);
      const newProfiles = action.payload.filter(
        (profile) => !existingIds.includes(profile._id)
      );
      state.profiles = [...state.profiles, ...newProfiles];
      state.loading = false;
    },
    removeProfile: (state, action) => {
      state.profiles = state.profiles.filter(
        (profile) => profile._id !== action.payload
      );
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    },
    clearProfiles: (state) => {
      state.profiles = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setLoading,
  setError,
  setFeedProfiles,
  removeProfile,
  incrementPage,
  clearProfiles,
} = feedSlice.actions;
export default feedSlice.reducer;
