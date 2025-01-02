import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import { setTrendingPortfolios } from "../features/portfolios/portfolioSlice";
import { setTrendingProjects } from "../features/projects/projectSlice";
import axios from "axios";

const useTrending = (selectedTab, selectedFilter) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await api.get(`/${selectedTab}/trending`);

        if (selectedTab == "portfolio") {
          dispatch(setTrendingPortfolios(response.data.portfolios));
        } else {
          dispatch(setTrendingProjects(response.data.projects));
        }
      } catch (error) {
        if (error.status === 401) {
          window.location.href = "/";
        }

        toast.error(error.response.data.error);
      }
    };

    fetchTrending();
  }, [selectedTab, selectedFilter]);
};

export default useTrending;
