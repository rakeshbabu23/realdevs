import React, { useState, useEffect } from "react";
import { Heart, Eye, Link as LinkIcon, Upload, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import { setUserPortfolio } from "../../../features/user/userSlice";
import ImageContainer from "./general/ImageContainer";
import FormContainer from "./general/FormContainer";
import UploadContainer from "./general/UploadContainer";
import api from "../../../services/api";

const UploadPortfolio = ({ url, onClose }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const [portfolioUrl, setPortfolioUrl] = useState(userInfo.portfolio.url);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await api.get("/portfolio/user");
        if (response.data && response.data.portfolio) {
          setPortfolioUrl(response.data.portfolio.url);
          dispatch(setUserPortfolio(response.data.portfolio));
        }
      } catch (error) {
        if (error.status === 401) {
          window.location.href = "/";
        }
        console.error("Failed to fetch user portfolio:", error);
        toast.error(error.response.data.error);
      }
    };

    fetchUserProjects();
  }, [dispatch]);
  const handlePortfolioUpload = async () => {
    try {
      if (portfolioUrl && !portfolioUrl.startsWith("https://")) {
        toast.error("Only URLs with HTTPS are accepted.");
        return;
      }

      setIsLoading(true);

      const response = await api.post("/portfolio", {
        url: portfolioUrl,
      });

      dispatch(setUserPortfolio(response.data.portfolio));
      toast.success("Portfolio uploaded successfully!");
      setIsLoading(false);
    } catch (error) {
      if (error.status === 401) {
        window.location.href = "/";
      }
      console.error(error);
      setIsLoading(false);
      toast.error(error.response.data.error);
    }
  };
  const handlePortfolioEdit = async () => {
    try {
      if (!portfolioUrl.startsWith("https://")) {
        toast.error("Only URLs with HTTPS are accepted.");
        return;
      }

      setIsLoading(true);

      const response = await api.patch("/portfolio", {
        url: portfolioUrl,
        portfolioId: userInfo.portfolio._id,
      });

      dispatch(setUserPortfolio(response.data.portfolio));
      toast.success("Portfolio updated successfully!");
      setIsLoading(false);
    } catch (error) {
      if (error.status === 401) {
        window.location.href = "/";
      }
      console.error(error);
      setIsLoading(false);
      toast.error(error.response.data.error);
    }
  };

  return (
    <UploadContainer>
      <ImageContainer>
        {userInfo.portfolio.url ? (
          <img
            src={userInfo.portfolio.image}
            alt="portfolio image"
            className="h-[200px] w-full"
          />
        ) : (
          <div className="h-[200px] w-full flex items-center justify-center">
            <Upload size={64} className="text-blue-400" />
          </div>
        )}
      </ImageContainer>

      <FormContainer>
        <div>
          <label
            htmlFor="portfolioUrl"
            className="block text-sm font-medium mb-1"
          >
            Portfolio URL
          </label>
          <input
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            type="text"
            id="portfolioUrl"
            className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://your-portfolio.com"
          />
        </div>

        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={() => {
            if (!userInfo.portfolio.url) {
              handlePortfolioUpload();
            } else {
              if (userInfo.portfolio.url === portfolioUrl) {
                toast.error("Portfolio URL is already set.");
                return;
              } else {
                handlePortfolioEdit();
              }
            }
          }}
        >
          {isLoading
            ? "Please wait..."
            : userInfo.portfolio.url
            ? "Edit"
            : "Upload"}
        </button>
        <p className="text-sm text-gray-400">
          You can update the portfolio URL up to 3 times. After which you need
          to upgrade.
        </p>
      </FormContainer>
    </UploadContainer>
  );
};

export default UploadPortfolio;
