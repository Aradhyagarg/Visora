import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.publish);
      } else {
        console.error("Failed to fetch creations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching creations:", error);
    }
  };

  const toggleLike = async (creationId) => {
    if (!user) return;

    setCreations((prev) =>
      prev.map((c) => {
        if (c._id === creationId) {
          const isLiked = c.likes.includes(user.id);
          return {
            ...c,
            likes: isLiked
              ? c.likes.filter((u) => u !== user.id)
              : [...c.likes, user.id],
          };
        }
        return c;
      })
    );

    try {
      const token = await getToken();
      await axios.post(
        "/api/user/toggle-like-creation",
        { id: creationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      fetchCreations();
    }
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold">Community Creations</h2>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll flex flex-wrap gap-4 p-4">
        {creations.length === 0 && (
          <p className="text-gray-400">No creations available yet</p>
        )}
        {creations.map((creation) => (
          <div
            key={creation._id}
            className="relative group w-full sm:w-[48%] lg:w-[32%]"
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 top-0 right-0 left-0 flex flex-col justify-between p-3 bg-gradient-to-b from-transparent to-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-sm">{creation.prompt}</p>
              <div className="flex gap-2 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => toggleLike(creation._id)}
                  className={`w-5 h-5 cursor-pointer ${
                    creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
