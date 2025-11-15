import { useAuth } from "@clerk/clerk-react";
import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState(null);
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("Please upload an image first");
      return;
    }

    if (!object.trim()) {
      toast.error("Please describe the object to remove");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      if (object.split(" ").length > 1) {
        toast.error("Please enter only one object name");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", input); 
      formData.append("object", object);
      
      console.log("Uploading file:", input.name);
      console.log("Object to remove:", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      console.log("Response:", data);

      if (data.success) {
        setContent(data.content);
        toast.success("Object removed successfully!");
      } else {
        toast.error(data.message || "Failed to remove object");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files?.[0] || null)}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-600"
          required
        />

        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>
        <input
          onChange={(e) => setObject(e.target.value)}
          value={object}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g. watch or spoon (single object only)"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Enter only one object name (no spaces)
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          {loading ? "Processing..." : "Remove Object"}
        </button>
      </form>

      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex-1 overflow-auto flex flex-col gap-3">
            <img 
              src={content} 
              alt="Processed" 
              className="w-full object-contain bg-gray-100 rounded"
              onError={(e) => {
                console.error("Image failed to load:", content);
                toast.error("Failed to load processed image");
              }}
              onLoad={() => console.log("Image loaded successfully")}
            />
            <a 
              href={content} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Open Full Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;