import React, { useState, useEffect } from "react";
import { Heart, Eye, Link as LinkIcon, Upload, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import {
  setUserPortfolio,
  setUserProjects,
} from "../../../../features/user/userSlice";
import ImageContainer from "../general/ImageContainer";
import FormContainer from "../general/FormContainer";
import UploadContainer from "../general/UploadContainer";
import api from "../../../../services/api";

const UploadProject = ({ onClose }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const [projectUrl, setprojectUrl] = useState("");
  const [isValidImage, setIsValidImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const handleProjectUpload = async () => {
    try {
      if (!projectUrl.startsWith("https://")) {
        toast.error("Only URLs with HTTPS are accepted.");
        return;
      }

      setIsLoading(true);
      const response = await api.post("/project", {
        url: projectUrl,
        title,
      });

      dispatch(setUserProjects(response.data.project));
      toast.success("Portfolio uploaded successfully!");
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.response.data.error);
    }
  };
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setprojectUrl(url);
  };

  return (
    <UploadContainer>
      <button
        onClick={onClose}
        className="absolute top-4 right-4  text-gray-400 hover:text-gray-200"
      >
        <X size={24} />
      </button>
      <ImageContainer>
        {isValidImage ? (
          <img src={projectUrl} alt="project" className="h-[200px]" />
        ) : (
          <div className="h-[200px] w-full flex items-center justify-center">
            <Upload size={64} className="text-blue-400" />
          </div>
        )}
      </ImageContainer>

      <FormContainer>
        <div>
          <label
            htmlFor="projectUrl"
            className="block text-sm font-medium mb-1"
          >
            Project URL
          </label>
          <input
            value={projectUrl}
            onChange={handleUrlChange}
            type="text"
            id="projectUrl"
            className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://your-project.com"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
            className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your awesome project title name"
          />
        </div>

        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={() => {
            handleProjectUpload();
          }}
        >
          {isLoading ? "Please wait..." : "Upload"}
        </button>
        <p className="text-sm text-gray-400">
          You can update the portfolio URL up to 3 times. After which you need
          to upgrade.
        </p>
      </FormContainer>
    </UploadContainer>
  );
};

export default UploadProject;
