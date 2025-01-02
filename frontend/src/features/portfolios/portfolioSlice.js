import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  portfolios: [],
  cursor: "",
  likedPortfolios: [],
  trendingPortfolios: [],
  totalPortfolios: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolios: (state, action) => {
      state.portfolios = action.payload.portfolios;
      state.totalPortfolios = action.payload.totalPortfolios;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    },
    setLikedPortfolios: (state, action) => {
      state.portfolios = state.portfolios.map((portfolio) => {
        if (portfolio._id === action.payload._id) {
          portfolio.likeCount = portfolio.alreadyLiked
            ? Math.max(0, portfolio.likeCount - 1)
            : portfolio.likeCount + 1;
          portfolio.alreadyLiked = portfolio.alreadyLiked ? 0 : 1;
        }
        return portfolio; // Return each portfolio, modified or not
      });
    },
    setTrendingPortfolios: (state, action) => {
      state.trendingPortfolios = action.payload;
    },
    incrementViewCountOfPortfolios: (state, action) => {
      state.portfolios = state.portfolios.map((portfolio) => {
        if (portfolio._id === action.payload._id) {
          portfolio.views += 1;
          return portfolio;
        }
        return portfolio;
      });
    },
  },
});

export const {
  setPortfolios,
  setLikedPortfolios,
  removeLikedPortfolio,
  setTrendingPortfolios,
  incrementViewCountOfPortfolios,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
