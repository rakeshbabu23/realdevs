import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heart, Eye, Link as LinkIcon, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import ProjectContainer from "./ProjectContainer";
import {
  setUserProjects,
  updateUserProjectAfterDelete,
} from "../../../../features/user/userSlice";
import api from "../../../../services/api";
function ProjectCard() {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await api.get("/project/user");
        if (response.data && response.data.projects) {
          dispatch(setUserProjects(response.data.projects));
        } else {
          console.error("No projects data found in response");
        }
      } catch (error) {
        console.error("Failed to fetch user projects:", error);
        toast.error(error.response.data.error);
      }
    };

    fetchUserProjects();
  }, [dispatch]);
  const handleDeleteProject = async (projectId) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/project/${projectId}`);
      dispatch(updateUserProjectAfterDelete({ _id: projectId }));
      toast.success("Project deleted successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.response.data.error);
    }
  };
  return (
    <>
      {userInfo && userInfo.projects.length > 0 ? (
        userInfo.projects.map((project) => (
          <ProjectContainer>
            <div className="max-sm:flex max-sm:flex-col max-sm:gap-2 md:flex md:flex-row md:gap-x-8">
              <div className="max-sm:w-full md:w-1/5">
                <img
                  className="object-cover max-sm:w-full md:w-52 h-auto"
                  src={project.image}
                  alt="Project Thumbnail"
                />
              </div>
              <div className="md:w-3/5 flex flex-col justify-start items-start">
                <h3 className="text-lg font-medium text-white mb-2">
                  {project.title}
                </h3>

                <a
                  href={project.url}
                  className="text-blue-400 hover:underline flex items-center mb-2"
                >
                  <LinkIcon size={16} className="mr-2" />
                  {project.url}
                </a>
                <div className="flex text-gray-400">
                  <span className="mr-4">
                    <Heart size={14} className="inline mr-1" />{" "}
                    {project.likes || 0}
                  </span>
                  <span>
                    <Eye size={14} className="inline mr-1" /> {project.views}
                  </span>
                </div>
              </div>
              <div className="max-sm:mt-2 md:w-1/5 md:flex md:flex-row-reverse md:justify-start md:items-start md:p-4">
                <div
                  className="p-2 bg-red-600 flex flex-col justify-center items-center rounded-md cursor-pointer"
                  onClick={() => {
                    handleDeleteProject(project._id);
                  }}
                >
                  <Trash2 size={24} className="inline mr-1" color="#fff" />
                </div>
              </div>
            </div>
          </ProjectContainer>
        ))
      ) : (
        <p className="text-center">Seems like you have not added project</p>
      )}
    </>
  );
}

export default ProjectCard;
