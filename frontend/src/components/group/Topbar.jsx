import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import { addNewGroup, setGroups } from "../../features/groups/groupSlice";
import { setUserReceiverProjects } from "../../features/user/userSlice";
import api from "../../services/api";
function Topbar() {
  const group = useSelector((state) => state.group);
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getUserGroups = async () => {
      try {
        const response = await api.get(`/group`);
        if (response.status === 200) {
          dispatch(setGroups(response.data.groups));
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    };
    getUserGroups();
  }, []);
  const handleCreateGroup = async () => {
    setModalOpen(true);
    try {
      setIsLoading(true);

      const response = await api.post("/group", {
        groupName: groupName,
      });

      if (response.status == 201) {
        setIsLoading(false);
        toast.success("Group created successfully");
        setModalOpen(false);
        dispatch(addNewGroup(response.data.group));
      }
    } catch (error) {
      toast.error(error.response.data.errors || error.response.data.error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const getUserSubmittedProjects = async () => {
      try {
        const response = await api.get(`/group/admin/${selectedGroup}`);
        if (response.status === 200) {
          dispatch(setUserReceiverProjects(response.data.portfolios));
        }
      } catch (error) {
        toast.error(error.response.data.errors || error.response.data.error);
      }
    };
    if (selectedGroup) {
      getUserSubmittedProjects();
    }
    if (group && group.groups.length > 0 && !selectedGroup) {
      setSelectedGroup(group.groups[0]._id);
    }
  }, [selectedGroup]);

  return (
    <>
      <div className="flex flex-row items-center gap-2 p-2 rounded-lg shadow-inner">
        <div className="flex flex-row items-center overflow-x-auto space-x-1">
          {group.groups.length > 0 &&
            group.groups.map((item) => (
              <div
                key={item._id.toString()}
                className={`w-32 text-gray-700 px-4 py-2 rounded-t-lg shadow-lg flex items-center justify-start cursor-pointer transition-all duration-300 ${
                  selectedGroup === item._id
                    ? "bg-purple-600 text-white"
                    : "bg-white"
                }`}
                onClick={() => setSelectedGroup(item._id)}
              >
                <p className="text-sm font-semibold">{item.groupName}</p>
              </div>
            ))}
        </div>
        <div
          className="bg-white w-fit px-3 py-2 rounded-full shadow-lg flex items-center justify-center border border-gray-300 cursor-pointer hover:bg-purple-600 hover:text-white transition-all duration-300"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <IoIosAdd size={20} />
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
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-md"
                />
                <p className="text-gray-400 text-sm">
                  Note: Please share this name with others to submit their
                  portfolios
                </p>
                <div className="flex flex-row justify-end">
                  <button
                    className={`w-32 px-4 py-2 bg-purple-600 text-white rounded-md flex flex-row justify-center items-center ${
                      !groupName && "opacity-50"
                    }`}
                    disabled={!groupName}
                    onClick={handleCreateGroup}
                  >
                    {isLoading ? (
                      <ClipLoader color="#fff" size="20" />
                    ) : (
                      "Create Group"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div
              className="absolute top-10 right-10 cursor-pointer z-50"
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

export default Topbar;
