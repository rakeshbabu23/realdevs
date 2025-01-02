const { userService } = require("../services");
const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.values);
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const nearByInterests = async (req, res) => {
  try {
    const { interests, users } = await userService.nearByInterests(req.values);
    return res
      .status(200)
      .json({ message: "Nearby interests found", interests, users });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const nearByPeople = async (req, res) => {
  try {
    const people = await userService.nearByPeople(req.values);
    return res.status(200).json({ message: "Nearby people found", people });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const userInfo = async (req, res) => {
  try {
    const user = await userService.userInfo(req.values);
    return res.status(200).json({ message: "User info found", user });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { updateProfile, nearByInterests, nearByPeople, userInfo };
