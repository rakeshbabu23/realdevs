import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import Portfolios from "./Portfolios";
import { useDispatch, useSelector } from "react-redux";
import Projects from "./home/Projects";
import Trending from "./Trending";
import { userLogout } from "../services/userService";
import useTrending from "../hooks/useTrending";
import useFetch from "../hooks/useFetch";

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("portfolio");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const portfolios = useSelector((state) => state.portfolio.portfolios);
  const portfoliosInfo = useSelector((state) => state.portfolio);
  const projects = useSelector((state) => state.project.projects);
  const projectsInfo = useSelector((state) => state.project);
  useTrending(selectedTab, selectedFilter);
  const { page, setPage, limit, setLimit } = useFetch(selectedTab);
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(12);

  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       const response = await api.get(
  //         `/${selectedTab}?page=${page}&limit=${limit}`
  //       );
  //       if (selectedTab == "portfolio") {
  //         dispatch(
  //           setPortfolios({
  //             portfolios: response.data.portfolios,
  //             totalPortfolios: response.data.totalPortfolios,
  //             page: response.data.page,
  //             limit: response.data.limit,
  //             totalPages: response.data.totalPages,
  //           })
  //         );
  //       } else {
  //         dispatch(
  //           setprojects({
  //             projects: response.data.projects,
  //             totalProjects: response.data.totalProjects,
  //             page: response.data.page,
  //             limit: response.data.limit,
  //             totalPages: response.data.totalPages,
  //           })
  //         );
  //       }
  //     } catch (error) {
  //
  //       toast.error(error.response.data.error);
  //     }
  //   };

  //   fetchAll();
  // }, [selectedTab, dispatch, page]);
  // useEffect(() => {
  //   const fetchTrending = async () => {
  //     try {
  //       const response = await api.get(`/${selectedTab}/trending`);

  //       if (selectedTab == "portfolio") {
  //         dispatch(setTrendingPortfolios(response.data.portfolios));
  //       } else {
  //         dispatch(setTrendingProjects(response.data.projects));
  //       }
  //     } catch (error) {
  //       if (error.status === 401) {
  //         window.location.href = "/";
  //       }
  //
  //       toast.error(error.response.data.error);
  //     }
  //   };

  //   fetchTrending();
  // }, [selectedFilter, selectedTab, dispatch]);
  const handleLogout = async () => {
    try {
      await userLogout();
      window.location.href = "/";
      toast.success("Logged out successfully!");
    } catch (error) {
      if (error.status === 401) {
        window.location.href = "/";
      }
      toast.error(error.response.data.error);
    }
  };
  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="flex mb-6 border-b justify-between">
        <div>
          <button
            type="button"
            className={`px-4 py-2 text-lg font-semibold focus:outline-none transition-colors duration-300 ${
              selectedTab === "portfolio"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-purple-600"
            }`}
            onClick={() => setSelectedTab("portfolio")}
          >
            Portfolios
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-lg font-semibold focus:outline-none transition-colors duration-300 ${
              selectedTab === "project"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-purple-600"
            }`}
            onClick={() => setSelectedTab("project")}
          >
            Projects
          </button>
        </div>

        <button
          type="button"
          className={`px-4 py-2 text-lg font-semibold focus:outline-none transition-colors duration-300 ${
            selectedTab === "project"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-purple-600"
          }`}
          onClick={() => handleLogout()}
        >
          <LogOut color="white" size={30} />
        </button>
      </div>
      <div className="mb-6">
        <select
          className="w-full md:w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="trending">Trending</option>
        </select>
      </div>
      <div className="py-2 ">
        {selectedTab == "portfolio" &&
          selectedFilter == "all" &&
          portfolios &&
          portfolios.length > 0 && <Portfolios />}
        {selectedTab == "portfolio" &&
          selectedFilter == "trending" &&
          portfolios &&
          portfolios.length > 0 && <Trending selectedTab={selectedTab} />}
        {selectedTab == "project" &&
          selectedFilter == "all" &&
          projects &&
          projects.length > 0 && <Projects />}
        {selectedTab == "project" &&
          selectedFilter == "trending" &&
          projects &&
          projects.length > 0 && <Trending selectedTab={selectedTab} />}
      </div>
      {selectedFilter !== "all" && selectedFilter !== "trending" && (
        <div className="py-2 flex flex-row justify-center items-center">
          {selectedTab === "portfolio" ? (
            <div className="flex flex-row justify-center items-center">
              {Array.from({ length: portfoliosInfo.totalPages }, (_, index) => (
                <p
                  key={index}
                  className={` ${
                    index + 1 === page
                      ? "bg-purple-600 text-white px-2 py-1 rounded-md"
                      : "text-purple-600 bg-black p-2"
                  }`}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex flex-row">
              {Array.from({ length: projectsInfo.totalPages }, (_, index) => (
                <p
                  key={index}
                  className={` ${
                    index + 1 === page
                      ? "bg-purple-600 text-white p-2"
                      : "text-purple-600"
                  }`}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
