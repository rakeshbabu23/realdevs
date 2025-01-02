import React, { useState } from "react";
import { Heart, Eye, Link as LinkIcon, Upload, X } from "lucide-react";
import { useSelector } from "react-redux";
import UploadPortfolio from "../../components/Dashboard/profile/UpdatePortfolio";
import UploadProject from "../../components/Dashboard/profile/project/UploadProject";
import ProjectCard from "../../components/Dashboard/profile/project/ProjectCard";
const NavItem = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-lg font-medium ${
      active ? "text-purple-500 border-b-2 border-purple-500" : "text-gray-400"
    } pb-2 mr-6`}
  >
    {label}
  </button>
);

const LikedItem = ({ type, title, link, likes, views }) => (
  <div className="bg-gray-800 rounded-lg p-4 mb-4">
    <span className="text-xs font-medium text-gray-400 uppercase mb-1 block">
      {type}
    </span>
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <a
      href={link}
      className="text-blue-400 hover:underline flex items-center mb-2"
    >
      <LinkIcon size={16} className="mr-2" />
      {link}
    </a>
    <div className="flex text-gray-400">
      <span className="mr-4">
        <Heart size={14} className="inline mr-1" /> {likes}
      </span>
      <span>
        <Eye size={14} className="inline mr-1" /> {views}
      </span>
    </div>
  </div>
);

function UserDashboard() {
  const [activeSection, setActiveSection] = useState("portfolios");
  const [isAddingProject, setIsAddingProject] = useState(false);

  const likedItems = [
    {
      type: "Portfolio",
      title: "Amazing Portfolio",
      link: "https://liked-portfolio.com",
      likes: 300,
      views: 1200,
    },
    {
      type: "Project",
      title: "Innovative Project",
      link: "https://liked-project.com",
      likes: 150,
      views: 600,
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white max-sm:p-2 md:p-8">
      <h1 className="max-sm:text-2xl md:text-3xl font-bold mb-8">
        My Dashboard
      </h1>

      <nav className="mb-8 border-b border-gray-700">
        <NavItem
          label="Portfolios"
          active={activeSection === "portfolios"}
          onClick={() => setActiveSection("portfolios")}
        />
        <NavItem
          label="Projects"
          active={activeSection === "projects"}
          onClick={() => setActiveSection("projects")}
        />
        {/* <NavItem
          label="Liked"
          active={activeSection === "liked"}
          onClick={() => setActiveSection("liked")}
        /> */}
      </nav>

      {activeSection === "portfolios" && <UploadPortfolio />}

      {activeSection === "projects" && (
        <div>
          {!isAddingProject ? (
            // Show "My Projects" section when isAddingProject is false
            <>
              <div className="flex flex-row justify-between items-center">
                <h2 className="max-sm:text-xl md:text-2xl font-semibold mb-4">
                  My Projects
                </h2>
                {/* Button to trigger Add Project mode */}
                <button
                  onClick={() => setIsAddingProject(true)} // Toggle to show UploadPortfolio
                  className="max-sm:text-xl md:text-2xl font-semibold mb-4 underline text-blue-500"
                >
                  Add Project
                </button>
              </div>

              <ProjectCard />
            </>
          ) : (
            // Show UploadPortfolio when isAddingProject is true
            <UploadProject onClose={() => setIsAddingProject(false)} />
          )}
        </div>
      )}

      {activeSection === "liked" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Liked Portfolios & Projects
          </h2>
          {likedItems.map((item, index) => (
            <LikedItem key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
