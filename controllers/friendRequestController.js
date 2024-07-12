const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

exports.sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id;

  if (recipientId === requesterId) {
    return res
      .status(400)
      .json({ msg: "You cannot send a friend request to yourself" });
  }

  try {
    const existingRequest = await FriendRequest.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    const friendRequest = new FriendRequest({
      requester: requesterId,
      recipient: recipientId,
    });

    await friendRequest.save();

    res.status(201).json({ msg: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getFriendRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const friendRequests = await FriendRequest.find({
      $or: [{ recipient: userId }, { requester: userId }],
    })
      .populate({
        path: "requester",
        select: "username email avatar",
      })
      .populate({
        path: "recipient",
        select: "username email avatar",
      })
      .exec();

    const receivedRequests = friendRequests
      .filter((request) => request.recipient._id.toString() === userId)
      .map((request) => ({
        _id: request._id,
        requester: request.requester,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      }));

    const sentRequests = friendRequests
      .filter((request) => request.requester._id.toString() === userId)
      .map((request) => ({
        _id: request._id,
        recipientId: request.recipient,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      }));

    res.status(200).json({ receivedRequests, sentRequests });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An error occurred while fetching friend requests." });
  }
};

exports.updateFriendRequest = async (req, res) => {
  const userId = req.user.id;
  const requestId = req.params.id;
  const { action } = req.body;

  try {
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ msg: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    if (action === "accepted") {
      await User.findByIdAndUpdate(friendRequest.requester, {
        $addToSet: { friends: friendRequest.recipient },
      });
      await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.requester },
      });
    } else if (action !== "declined") {
      return res.status(400).json({ msg: "Invalid action" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ msg: `Friend request ${action}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getFriendList = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate(
      "friends",
      "username email avatar"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ msg: "Search query is required" });
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.user.id },
    }).select("name username");

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).send("Server error");
  }
};
