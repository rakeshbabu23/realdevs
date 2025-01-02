import React, { useState, useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { TbDeviceMobileShare } from "react-icons/tb";
import { ImNewTab } from "react-icons/im";
import Card from "../../components/Dashboard/Card";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setLikedProjects,
  incrementViewCountOfProjects,
} from "../../features/projects/projectSlice";
import api from "../../services/api";

function Projects() {
  const dispatch = useDispatch();
  const { projects, likedProjects } = useSelector((state) => state.project);
  const [showOverlay, setShowOverlay] = useState({
    show: false,
    id: "",
  });
  const addLike = async (project) => {
    try {
       await api.post("/project/like", {
        projectId: project._id,
      });

      dispatch(setLikedProjects(project));
    } catch (error) {
      if (error.status === 401) {
        window.location.href = "/";
      }
      toast.error(error.response.data.error);
    }
  };
  const handleView = async (project, device) => {
    dispatch(incrementViewCountOfProjects({ _id: project._id }));
    if (device === "mobile") {
      const openInMobilePopup = () => {
        const width = 375; // Mobile width (e.g., iPhone X)
        const height = 812; // Mobile height
        const left = (window.screen.width - width) / 2; // Center horizontally
        const top = (window.screen.height - height) / 2; // Center vertically

        window.open(
          `${project.url}`, // Replace with your URL
          "_blank", // Opens in a new popup-like window
          `width=${width},height=${height},top=${top},left=${left}`
        );
      };
      openInMobilePopup();
    } else {
      const openLinkInNewTab = () => {
        window.open(
          `${project.url}`, // Replace with your URL
          "_blank" // Opens in a new tab
        );
      };
      openLinkInNewTab();
    }
    try {
      const projectId = project._id;
      await api.post(`/project/view/${projectId}`, {});
    } catch (error) {
      if (error.status === 401) {
        window.location.href = "/";
      }
      toast.error(error.response.data.error);
    }
  };
  function checkLikedProject(currentProject) {
    const project = projects.find(
      (project) => project._id === currentProject._id
    );
    return project ? project.alreadyLiked : false;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.length > 0 &&
        projects.map((project) => {
          return (
            <Card url={project.url}>
              <div
                className="relative w-full h-48 bg-gray-900 rounded-t-lg overflow-hidden"
                onMouseEnter={() =>
                  setShowOverlay({ show: true, id: project._id })
                }
                onMouseLeave={() => setShowOverlay({ show: false, id: null })}
              >
                <img
                  src={
                    project.image ? project.image : "/api/placeholder/400/240"
                  }
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {showOverlay.id == project._id && (
                  <>
                    <div className="bg-black opacity-50 absolute top-0 left-0 w-full h-48 flex flex-row items-center justify-center gap-8">
                      <span onClick={() => handleView(project, "mobile")}>
                        <TbDeviceMobileShare color="white" size={24} />
                      </span>
                      <span onClick={() => handleView(project, "desktop")}>
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
                        color={checkLikedProject(project) ? "red" : "white"}
                        onClick={() => addLike(project)}
                        fill={checkLikedProject(project) && "red"}
                      />
                      <span className="text-sm text-white">
                        {project.likeCount + Number(project.projectLikeCount)}
                      </span>
                    </button>
                    <Eye size={18} color="white" />
                    <span className="text-sm text-white">
                      {project.views + Number(project.projectViews)} views
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

export default Projects;
