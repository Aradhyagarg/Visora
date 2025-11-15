import { Protect, useAuth, useUser } from "@clerk/clerk-react";
import { Gem, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CreationItem from "../components/CreationItem";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchUserCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        console.error("Failed to fetch user creations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching creations:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCreations();
    }
  }, [user]);

  return (
    <div className="h-full overflow-y-scroll">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[250px] p-6 bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Creations</p>
              <h2 className="text-2xl font-bold">{creations.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[250px] p-6 bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Active Plan</p>
              <h2 className="text-2xl font-bold">
                <Protect plan="premium" fallback="Free">Premium</Protect>
              </h2>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex items-center justify-center">
              <Gem className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Creations</h3>
        {creations.length === 0 ? (
          <p className="text-gray-400">You haven’t created anything yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creations.map((item) => (
              <CreationItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;