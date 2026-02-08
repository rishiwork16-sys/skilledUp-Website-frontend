import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const API_HOST = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_BASE_URL = `${API_HOST}/api/careers`;

const JD = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Job not found or error loading details.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-red-600">{error || "Job not found"}</p>
        <button
          onClick={() => navigate("/careers")}
          className="px-6 py-2 bg-[#0098F1] text-white rounded-lg hover:bg-[#007bb5] transition-all"
        >
          Back to Careers
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section */}
          <div className="bg-[#0098F1] text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90">
              <span className="flex items-center gap-1">
                📍 {job.location}
              </span>
              <span className="flex items-center gap-1">
                💼 {job.type}
              </span>
              <span className="flex items-center gap-1">
                💰 {job.salary}
              </span>
              <span className="flex items-center gap-1">
                📅 Posted: {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* About Company - Static for now as per requirement */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-[#0098F1] inline-block mb-4 pb-1">
                About SkilledUp
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in October 2022, skilledUp is a fast-growing EdTech and professional training platform focused on building job-ready talent in Data Science, Analytics, AI, and emerging technologies.
                We offer industry-aligned online and offline programs backed by hands-on projects, internships, and structured interview preparation from day one.
              </p>
            </section>

            {/* Role Overview */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-[#0098F1] inline-block mb-4 pb-1">
                Role Overview
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* Requirements / Responsibilities */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-[#0098F1] inline-block mb-4 pb-1">
                Key Responsibilities & Requirements
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-[#0098F1] inline-block mb-4 pb-1">
                Experience Required
              </h2>
              <p className="text-gray-600 font-medium">
                {job.experience}
              </p>
            </section>

            {/* Apply Button */}
            <div className="pt-6 border-t border-gray-100 flex justify-center">
              <button
                onClick={() => navigate(`/careers/apply/${job.id}`)}
                className="px-10 py-3 bg-[#0098F1] text-white text-lg font-bold rounded-full shadow-lg hover:bg-[#007bb5] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Apply Now
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JD;
