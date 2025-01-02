import React, { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import { TbDeviceMobileShare } from "react-icons/tb";
import { ImNewTab } from "react-icons/im";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  incrementViewCountOfPortfolios,
  setLikedPortfolios,
} from "../features/portfolios/portfolioSlice";
import api from "../services/api";

function Portfolios() {
  const dispatch = useDispatch();
  const { portfolios, likedPortfolios } = useSelector(
    (state) => state.portfolio
  );
  const [showOverlay, setShowOverlay] = useState({
    show: false,
    id: "",
  });

  const addLike = async (portfolio) => {
    try {
      await api.post("/portfolio/like", {
        portfolioId: portfolio._id,
      });

      dispatch(setLikedPortfolios(portfolio));
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  const handleView = async (portfolio, device) => {
    dispatch(incrementViewCountOfPortfolios({ _id: portfolio._id }));

    if (device === "mobile") {
      const openInMobilePopup = () => {
        const width = 375; // Mobile width (e.g., iPhone X)
        const height = 812; // Mobile height
        const left = (window.screen.width - width) / 2; // Center horizontally
        const top = (window.screen.height - height) / 2; // Center vertically

        window.open(
          `${portfolio.url}`, // Replace with your URL
          "_blank", // Opens in a new popup-like window
          `width=${width},height=${height},top=${top},left=${left}`
        );
      };
      openInMobilePopup();
    } else {
      const openLinkInNewTab = () => {
        window.open(
          `${portfolio.url}`, // Replace with your URL
          "_blank" // Opens in a new tab
        );
      };
      openLinkInNewTab();
    }
    try {
      const portfolioId = portfolio._id;
      await api.post(`/portfolio/view/${portfolioId}`, {});
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  function checkLikedPortfolio(currentPortfolio) {
    const portfolio = portfolios.find(
      (portfolio) => portfolio._id === currentPortfolio._id
    );
    return portfolio ? portfolio.alreadyLiked : false;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios &&
        portfolios.length > 0 &&
        portfolios.map((portfolio) => {
          return (
            <Card url={portfolio.url}>
              <div
                className="relative w-full h-48 bg-gray-900 rounded-t-lg overflow-hidden"
                onMouseEnter={() =>
                  setShowOverlay({ show: true, id: portfolio._id })
                }
                onMouseLeave={() => setShowOverlay({ show: false, id: null })}
              >
                <img
                  src={
                    portfolio.image
                      ? portfolio.image
                      : "https://placeholder/400/240"
                  }
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {showOverlay.id == portfolio._id && (
                  <>
                    <div className="bg-black opacity-50 absolute top-0 left-0 w-full h-48 flex flex-row items-center justify-center gap-8">
                      <span onClick={() => handleView(portfolio, "mobile")}>
                        <TbDeviceMobileShare color="white" size={24} />
                      </span>
                      <span onClick={() => handleView(portfolio, "desktop")}>
                        <ImNewTab color="white" size={24} />
                      </span>
                    </div>
                  </>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <button className="flex items-center space-x-1 text-white hover:text-red-500 transition-colors duration-300">
                      <Heart
                        size={18}
                        color={checkLikedPortfolio(portfolio) ? "red" : "white"}
                        onClick={() => addLike(portfolio)}
                        fill={checkLikedPortfolio(portfolio) && "red"}
                      />
                      <span className="text-sm text-white">
                        {portfolio.likeCount +
                          Number(portfolio.portfolioLikeCount)}
                      </span>
                    </button>
                    <Eye size={18} color="white" />
                    <span className="text-sm text-white">
                      {portfolio.views + Number(portfolio.portfolioViews)} views
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
}

export default Portfolios;
