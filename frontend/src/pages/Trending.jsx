import React from "react";
import { Heart, Eye } from "lucide-react";
import { useSelector } from "react-redux";

function Trending({ selectedTab }) {
  const trendingPortfolios = useSelector(
    (state) => state.portfolio.trendingPortfolios
  );
  const trendingProjects = useSelector(
    (state) => state.project.trendingProjects
  );
  const trending =
    selectedTab === "portfolio" ? trendingPortfolios : trendingProjects;

  const renderTrendingLayout = () => {
    return (
      <div className="space-y-6">
        {trending.map(
          (portfolio, index) =>
            (portfolio.likeCount > 0 || portfolio.views > 0) && (
              <a
                key={index}
                href={portfolio.url} // Open URL on click
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security best practice
                className="relative bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 overflow-hidden flex"
              >
                {/* Trending Badge */}
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
                  Trending #{index + 1}
                </div>

                {/* Thumbnail Image */}
                <img
                  src={portfolio.image}
                  alt={portfolio.title}
                  className="w-32 h-32 object-cover rounded-l-lg"
                />

                {/* Content */}
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {portfolio.description}
                  </p>
                  <div className="flex flex-col justify-start items-start gap-4 text-gray-300 text-xs">
                    <div className="flex items-center">
                      <Heart size={14} className="mr-1" />
                      <span>{portfolio.likeCount}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      <span>{portfolio.views} views</span>
                    </div>
                  </div>
                </div>
              </a>
            )
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="py-4">{renderTrendingLayout()}</div>
    </div>
  );
}

export default Trending;
