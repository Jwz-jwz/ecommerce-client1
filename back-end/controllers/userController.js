import { User } from "../models/user.js";

const syncUser = async (req, res) => {
  const userId = req.auth.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { _id: userId },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "User synced successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync user" });
  }
};

const likeProduct = async (req, res) => {
  const userId = req.auth.userId || req.auth.sub;
  const { productId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isLiked = user.likedProducts.includes(productId);

    if (isLiked) {
      // Remove if already liked
      user.likedProducts.pull(productId);
    } else {
      // Add if not liked
      user.likedProducts.addToSet(productId);
    }

    await user.save();
    res.json(user.likedProducts);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getLikedProducts = async (req, res) => {
  // Get userId from Clerk auth
  const userId = req.auth.userId || req.auth.sub;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId).populate("likedProducts");

    res.json(user?.likedProducts || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch liked products" });
  }
};

export { syncUser, likeProduct, getLikedProducts };
