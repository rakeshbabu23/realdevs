import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  addProjectToSubmittedProjects,
  setUserSubmittedProjects,
} from "../../features/user/userSlice";
import api from "../../services/api";
function Share() {
  const user = useSelector((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserSubmittedProjects = async () => {
      try {
        const response = await api.get(`/group/user`);
        dispatch(setUserSubmittedProjects(response.data.portfolios));
      } catch (error) {
        toast.error(error.response.data.error);
      }
    };
    getUserSubmittedProjects();
  }, [dispatch, isLoading]);
  const handleSubmitProject = async () => {
    setModalOpen(true);
    try {
      setIsLoading(true);

      const response = await api.post("/group/submit", {
        groupName: groupName,
        url: url,
      });

      if (response.status == 201) {
        setIsLoading(false);
        toast.success("Submitted successfully");
        setModalOpen(false);
        dispatch(addProjectToSubmittedProjects(response.data.portfolio));
      }
    } catch (error) {
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="p-2 md:p-4 lg:p-6 bg-black min-h-screen">
        <div className="flex flex-row items-center gap-2 p-2 rounded-lg shadow-inner">
          <div className="w-full flex flex-row justify-end items-center">
            <div
              className="bg-purple-600 w-fit px-3 py-2 rounded-full shadow-lg flex items-center justify-center border border-gray-300 cursor-pointer hover:bg-purple-600 hover:text-white transition-all duration-300"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Submit Portfolio
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {user.submittedProjects && user.submittedProjects.length > 0 ? (
            user.submittedProjects.map((portfolio) => (
              <div
                className="p-2 flex flex-col md:flex md:flex-row md:w-full md:mb-2 bg-gray-800 md:p-2 "
                key={portfolio._id}
              >
                <div className="w-full md:w-1/5 md:mr-4">
                  <img
                    src={
                      portfolio.image && portfolio.image[0]
                        ? portfolio.image[0]
                        : "https://placeholder/400/240"
                    }
                    alt="Video thumbnail"
                    className="object-cover w-full h-auto"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-1 md:gap-2">
                  <p className="text-white">
                    Submitted to:{" "}
                    <span className="font-bold">
                      {portfolio.groupId.groupName}
                    </span>
                  </p>
                  <p className="text-white">
                    Submitted on:{" "}
                    <span className="font-bold">
                      {new Date(portfolio.groupId.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-purple-600 text-center">
              You have not submitted any portfolios
            </p>
          )}
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
          <div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
            // onClick={() => setModalOpen(false)}
          >
            <div className="bg-white max-sm:w-4/5 md:w-2/5 p-4 shadow-md rounded-md">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  className={`w-full px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-md `}
                />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Portfolio URL"
                  className={`w-full px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-md `}
                />
                <div className="flex flex-row justify-end">
                  <button
                    className={`w-32 px-4 py-2 bg-purple-600 text-white rounded-md flex flex-row justify-center items-center ${
                      (!groupName || !url) && "opacity-50"
                    }`}
                    disabled={!groupName || !url}
                    onClick={handleSubmitProject}
                  >
                    {isLoading ? (
                      <ClipLoader color="#fff" size="20" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div
              className="absolute top-20 right-20 cursor-pointer"
              onClick={() => setModalOpen(false)}
            >
              <RxCross1 color="white" size="24" />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Share;
