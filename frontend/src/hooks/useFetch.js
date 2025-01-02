import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import { setPortfolios } from "../features/portfolios/portfolioSlice";
import { setprojects } from "../features/projects/projectSlice";
import axios from "axios";

const useFetch = (selectedTab) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get(
          `/${selectedTab}?page=${page}&limit=${limit}`
        );
        if (selectedTab === "portfolio") {
          dispatch(
            setPortfolios({
              portfolios: response.data.portfolios,
              totalPortfolios: response.data.totalPortfolios,
              page: response.data.page,
              limit: response.data.limit,
              totalPages: response.data.totalPages,
            })
          );
        } else {
          dispatch(
            setprojects({
              projects: response.data.projects,
              totalProjects: response.data.totalProjects,
              page: response.data.page,
              limit: response.data.limit,
              totalPages: response.data.totalPages,
            })
          );
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    };

    fetchAll();
  }, [selectedTab]);
  return { page, setPage, limit, setLimit };
};

export default useFetch;