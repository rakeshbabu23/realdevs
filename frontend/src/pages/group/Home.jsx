import React, { useState, useEffect } from "react";
import Topbar from "../../components/group/Topbar";
import { useDispatch, useSelector } from "react-redux";
import { TbDeviceMobileShare } from "react-icons/tb";
import { ImNewTab } from "react-icons/im";
import Card from "../../components/Dashboard/Card";
function Home() {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState({
    show: false,
    id: "",
  });
  const dispatch = useDispatch();
  const handleView = async (portfolio, device) => {
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
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <Topbar />
      <p className="text-white text-base py-4">
        Received Portfolios:{" "}
        <span>{user.receivedProjects && user.receivedProjects.length}</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.receivedProjects &&
          user.receivedProjects.length > 0 &&
          user.receivedProjects.map((portfolio) => {
            return (
              <Card>
                <div
                  className="relative flex flex-col w-full h-48 bg-gray-900 rounded-t-lg overflow-hidden"
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
                    className="w-full h-full object-cover"
                  />

                  {portfolio &&
                    showOverlay &&
                    showOverlay.id === portfolio._id && (
                      <div className="bg-black opacity-50 absolute top-0 left-0 w-full h-48 flex flex-row items-center justify-center gap-8">
                        <span onClick={() => handleView(portfolio, "mobile")}>
                          <TbDeviceMobileShare color="white" size={24} />
                        </span>
                        <span onClick={() => handleView(portfolio, "desktop")}>
                          <ImNewTab color="white" size={24} />
                        </span>
                      </div>
                    )}
                </div>

                {/* Email displayed under the image */}
                <p className="mt-1">
                  <span className="text-base text-white inline-block mr-2">
                    From
                  </span>
                  <a
                    href={`mailto:${portfolio.userId.email}`}
                    className="text-blue-500 underline"
                  >
                    {portfolio.userId.email}
                  </a>
                </p>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
