"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ReportForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    claim: "",
    category: "",
    urgency: "",
    sourceUrl: "",
    additionalInfo: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ছবির আকার ৫ MB এর কম হতে হবে");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.claim.trim()) {
      toast.error("দয়া করে দাবির বিবরণ লিখুন");
      return;
    }

    if (!formData.category) {
      toast.error("দয়া করে একটি বিভাগ নির্বাচন করুন");
      return;
    }

    if (!formData.urgency) {
      toast.error("দয়া করে গুরুত্ব স্তর নির্বাচন করুন");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      const report = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toLocaleString("bn-BD"),
        status: "pending",
        image: imagePreview,
      };

      // Call parent's onSubmit
      onSubmit(report);

      // Show success message
      toast.success("✅ আপনার রিপোর্ট সফলভাবে জমা হয়েছে!");

      // Reset form
      setFormData({
        claim: "",
        category: "",
        urgency: "",
        sourceUrl: "",
        additionalInfo: "",
      });
      setImagePreview(null);
      setIsSubmitting(false);

      // Reset file input
      const fileInput = document.getElementById("imageUpload");
      if (fileInput) fileInput.value = "";
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      {/* Claim Description */}
      <div className="mb-6">
        <label
          htmlFor="claim"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          দাবির বিবরণ *
        </label>
        <textarea
          id="claim"
          name="claim"
          value={formData.claim}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
          placeholder="আপনি যে তথ্যটি সন্দেহজনক মনে করছেন তা এখানে লিখুন..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          উদাহরণ: "ইভিএম মেশিন দূর থেকে হ্যাক করা যায়"
        </p>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          বিভাগ *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
          required
        >
          <option value="">একটি বিভাগ নির্বাচন করুন</option>
          <option value="নির্বাচন">🗳️ নির্বাচন</option>
          <option value="ধর্মীয়">🕌 ধর্মীয়</option>
          <option value="স্ক্যাম">💰 স্ক্যাম</option>
          <option value="স্বাস্থ্য">🏥 স্বাস্থ্য</option>
          <option value="অন্যান্য">📋 অন্যান্য</option>
        </select>
      </div>

      {/* Urgency Level */}
      <div className="mb-6">
        <label
          htmlFor="urgency"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          গুরুত্ব স্তর *
        </label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
          required
        >
          <option value="">নির্বাচন করুন</option>
          <option value="উচ্চ">🔴 উচ্চ - জরুরি যাচাই প্রয়োজন</option>
          <option value="মাঝারি">🟡 মাঝারি - দ্রুত যাচাই প্রয়োজন</option>
          <option value="নিম্ন">🟢 নিম্ন - সাধারণ যাচাই</option>
        </select>
      </div>

      {/* Source URL */}
      <div className="mb-6">
        <label
          htmlFor="sourceUrl"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          সূত্র (ঐচ্ছিক)
        </label>
        <input
          type="url"
          id="sourceUrl"
          name="sourceUrl"
          value={formData.sourceUrl}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
          placeholder="https://example.com/post"
        />
        <p className="text-xs text-gray-500 mt-1">
          ফেসবুক পোস্ট, নিউজ আর্টিকেল বা অন্য কোনো লিংক যোগ করুন
        </p>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label
          htmlFor="imageUpload"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          স্ক্রিনশট বা ছবি (ঐচ্ছিক)
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          সর্বোচ্চ ৫ MB | JPG, PNG, WebP
        </p>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-w-md rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                const fileInput = document.getElementById("imageUpload");
                if (fileInput) fileInput.value = "";
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="mb-6">
        <label
          htmlFor="additionalInfo"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          অতিরিক্ত তথ্য (ঐচ্ছিক)
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
          placeholder="এই দাবি সম্পর্কে অন্য কিছু জানাতে চান?"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 hover:shadow-lg"
        }`}
      >
        {isSubmitting ? "জমা হচ্ছে..." : "📤 রিপোর্ট জমা দিন"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        রিপোর্ট জমা দিয়ে আপনি আমাদের{" "}
        <a href="/terms" className="text-red-600 hover:underline font-semibold">
          শর্তাবলী
        </a>{" "}
        মেনে নিচ্ছেন
      </p>
    </form>
  );
}
