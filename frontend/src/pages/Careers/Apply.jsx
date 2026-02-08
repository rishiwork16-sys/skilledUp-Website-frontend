import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Work mode mapping
const WORK_MODE_MAP = {
  "remote": "REMOTE",
  "on-site": "ONSITE",
  "onsite": "ONSITE",
  "hybrid": "HYBRID",
};

// Base URL for API
const API_HOST = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_BASE_URL = `${API_HOST}/api/careers`;

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Basic Details
    fullName: "",
    email: "",
    phone: "",
    
    // Location
    city: "",
    state: "",
    pincode: "",
    
    // Job Preference
    workMode: "ONSITE",
    preferredLocation: "",
    
    // Experience
    currentCompany: "",
    totalExperience: "",
    relevantExperience: "",
    noticePeriod: "",
    
    // Resume - will be handled separately as file
    resumeFile: null,
    
    // Optional Links
    linkedinUrl: "",
    githubUrl: "",
    otherPortfolioUrl: "",
    
    // Optional Info
    additionalInformation: "",
  });

  const [formErrors, setFormErrors] = useState({});

  /* ================= LOAD JOB (SAFE) ================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
        const found = response.data;
        setJob(found);
        
        // Set work mode based on job data
        const workMode = (found.type || "").toUpperCase().includes("REMOTE") ? "REMOTE" : "ONSITE";
        
        setForm((prev) => ({
          ...prev,
          workMode: workMode,
          preferredLocation: found.location || "",
        }));
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Job not found or API error");
      }
    };

    if (jobId) {
        fetchJob();
    }
  }, [jobId]);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resumeFile") {
      const file = files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
        setError("Please upload a PDF or Word document");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setForm((prev) => ({ ...prev, resumeFile: file }));
      
      // Clear previous errors
      if (formErrors.resumeFile) {
        setFormErrors(prev => ({ ...prev, resumeFile: "" }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
    
    // Clear general error
    if (error) setError("");
  };

  /* ================= VALIDATE FORM ================= */
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email format";
    
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) errors.phone = "Invalid phone number";
    
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Invalid pincode";
    
    if (!form.currentCompany.trim()) errors.currentCompany = "Current company is required";
    
    if (!form.preferredLocation.trim()) errors.preferredLocation = "Preferred location is required";
    
    // Experience validation
    const totalExp = parseFloat(form.totalExperience);
    if (isNaN(totalExp) || totalExp < 0) errors.totalExperience = "Total experience must be 0 or greater";
    
    const relevantExp = parseFloat(form.relevantExperience);
    if (isNaN(relevantExp) || relevantExp < 0) errors.relevantExperience = "Relevant experience must be 0 or greater";
    
    if (!form.noticePeriod.trim()) errors.noticePeriod = "Notice period is required";
    
    // Resume validation
    if (!form.resumeFile) errors.resumeFile = "Resume is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= SUBMIT FORM ================= */
  const submitForm = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    if (!form.resumeFile) {
      setError("Please upload your resume");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData for multipart request
      const formData = new FormData();
      
      // Create the JSON data part
      const jobApplyRequest = {
        jobId: parseInt(jobId),
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        workMode: form.workMode,
        preferredLocation: form.preferredLocation,
        currentCompany: form.currentCompany,
        totalExperience: parseFloat(form.totalExperience) || 0,
        relevantExperience: parseFloat(form.relevantExperience) || 0,
        noticePeriod: form.noticePeriod,
        resumeUrl: "", // This will be set by backend after upload
        linkedinUrl: form.linkedinUrl || "",
        githubUrl: form.githubUrl || "",
        otherPortfolioUrl: form.otherPortfolioUrl || "",
        additionalInformation: form.additionalInformation || "",
      };

      // Append JSON data as string
      formData.append("data", JSON.stringify(jobApplyRequest));
      
      // Append resume file
      formData.append("resume", form.resumeFile);

      // Make API call
      const response = await axios.post(`${API_BASE_URL}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Application submitted successfully:", response.data);
      
      // Show success message
      alert(
        "Application Submitted Successfully!\n\n" +
        "Thank you for applying. Your profile will be reviewed by our team, " +
        "and if shortlisted, our HR team will contact you shortly regarding the next steps."
      );
      
      // Optionally redirect to confirmation page or home
      navigate("/");
      
    } catch (err) {
      console.error("Error submitting application:", err);
      
      // Handle specific error responses
      if (err.response) {
        // Server responded with error status
        const errorMsg = err.response.data?.message || 
                        err.response.data?.error || 
                        "Failed to submit application. Please try again.";
        setError(errorMsg);
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div style={{ 
        padding: "40px", 
        textAlign: "center",
        color: error ? "#dc2626" : "#374151"
      }}>
        {error || "Loading..."}
      </div>
    );
  }

  /* ================= STYLES ================= */
  const containerStyle = {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "0 20px",
  };

  const headerStyle = {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "8px",
  };

  const subHeaderStyle = {
    fontSize: "13px",
    color: "#4e5666",
    marginBottom: "20px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    marginTop: "18px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#dc2626",
  };

  const textareaStyle = {
    width: "100%",
    height: "144px",
    padding: "10px",
    marginTop: "6px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const errorTextareaStyle = {
    ...textareaStyle,
    borderColor: "#dc2626",
  };

  const errorMessageStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
  };

  const submitButtonStyle = {
    marginTop: "30px",
    padding: "14px 24px",
    display: "block",
    width: "auto",
    minWidth: "180px",
    maxWidth: "100%",
    background: loading ? "#9ca3af" : "#264f9b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
  };

  /* ================= FORM FIELDS CONFIGURATION ================= */
  const basicFields = [
    { label: "Full Name", name: "fullName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone", name: "phone", type: "tel", required: true },
  ];

  const locationFields = [
    { label: "City", name: "city", type: "text", required: true },
    { label: "State", name: "state", type: "text", required: true },
    { label: "Pincode", name: "pincode", type: "text", required: true },
  ];

  const experienceFields = [
    { label: "Current Company", name: "currentCompany", type: "text", required: true },
    { label: "Total Experience (years)", name: "totalExperience", type: "number", step: "0.1", required: true },
    { label: "Relevant Experience (years)", name: "relevantExperience", type: "number", step: "0.1", required: true },
    { label: "Notice Period", name: "noticePeriod", type: "text", required: true },
  ];

  const optionalFields = [
    { label: "LinkedIn URL", name: "linkedinUrl", type: "url" },
    { label: "GitHub URL", name: "githubUrl", type: "url" },
    { label: "Other Portfolio URL", name: "otherPortfolioUrl", type: "url" },
  ];

  return (
    <div style={containerStyle}>
      {/* ================= HEADER ================= */}
      <h1 style={headerStyle}>Apply for {job.role}</h1>
      
      <p style={subHeaderStyle}>
        {job.department && `${job.department} • `}
        {job.location && `${job.location} • `}
        {(job.mode || job.workModeDetail) && `${job.mode || job.workModeDetail} • `}
        {job.type || job.employmentType || ""}
      </p>

      <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />

      {/* ================= ERROR MESSAGE ================= */}
      {error && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          borderRadius: "6px",
          color: "#dc2626",
          fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      {/* ================= RESUME UPLOAD ================= */}
      <div>
        <label style={labelStyle}>
          Upload Resume (PDF or Word) *
        </label>
        <input
          type="file"
          name="resumeFile"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
          style={formErrors.resumeFile ? errorInputStyle : inputStyle}
          disabled={loading}
        />
        {formErrors.resumeFile && (
          <span style={errorMessageStyle}>{formErrors.resumeFile}</span>
        )}
        {form.resumeFile && (
          <span style={{ fontSize: "12px", color: "#059669", marginTop: "4px", display: "block" }}>
            Selected: {form.resumeFile.name}
          </span>
        )}
      </div>

      {/* ================= BASIC DETAILS ================= */}
      <h3 style={{ marginTop: "30px", fontSize: "18px", fontWeight: 600 }}>Basic Details</h3>
      {basicFields.map(({ label, name, type, required }) => (
        <div key={name}>
          <label style={labelStyle}>
            {label} {required && "*"}
          </label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            style={formErrors[name] ? errorInputStyle : inputStyle}
            disabled={loading}
            required={required}
          />
          {formErrors[name] && (
            <span style={errorMessageStyle}>{formErrors[name]}</span>
          )}
        </div>
      ))}

      {/* ================= LOCATION ================= */}
      <h3 style={{ marginTop: "30px", fontSize: "18px", fontWeight: 600 }}>Location Details</h3>
      {locationFields.map(({ label, name, type, required }) => (
        <div key={name}>
          <label style={labelStyle}>
            {label} {required && "*"}
          </label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            style={formErrors[name] ? errorInputStyle : inputStyle}
            disabled={loading}
            required={required}
          />
          {formErrors[name] && (
            <span style={errorMessageStyle}>{formErrors[name]}</span>
          )}
        </div>
      ))}

      {/* ================= WORK MODE ================= */}
      <div>
        <label style={labelStyle}>Work Mode *</label>
        <select
          name="workMode"
          value={form.workMode}
          onChange={handleChange}
          style={inputStyle}
          disabled={loading}
        >
          <option value="REMOTE">Remote</option>
          <option value="ONSITE">Onsite</option>
          <option value="HYBRID">Hybrid</option>
        </select>
      </div>

      {/* ================= PREFERRED LOCATION ================= */}
      <div>
        <label style={labelStyle}>Preferred Location *</label>
        <input
          type="text"
          name="preferredLocation"
          value={form.preferredLocation}
          onChange={handleChange}
          style={formErrors.preferredLocation ? errorInputStyle : inputStyle}
          disabled={loading}
        />
        {formErrors.preferredLocation && (
          <span style={errorMessageStyle}>{formErrors.preferredLocation}</span>
        )}
      </div>

      {/* ================= EXPERIENCE DETAILS ================= */}
      <h3 style={{ marginTop: "30px", fontSize: "18px", fontWeight: 600 }}>Experience Details</h3>
      {experienceFields.map(({ label, name, type, step, required }) => (
        <div key={name}>
          <label style={labelStyle}>
            {label} {required && "*"}
          </label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            step={step}
            style={formErrors[name] ? errorInputStyle : inputStyle}
            disabled={loading}
            required={required}
          />
          {formErrors[name] && (
            <span style={errorMessageStyle}>{formErrors[name]}</span>
          )}
        </div>
      ))}

      {/* ================= ADDITIONAL INFORMATION ================= */}
      <div>
        <label style={labelStyle}>Additional Information</label>
        <textarea
          name="additionalInformation"
          value={form.additionalInformation}
          onChange={handleChange}
          style={textareaStyle}
          disabled={loading}
          placeholder="Any additional information you'd like to share..."
        />
      </div>

      {/* ================= OPTIONAL LINKS ================= */}
      <h3 style={{ marginTop: "30px", fontSize: "18px", fontWeight: 600 }}>Portfolio Links (Optional)</h3>
      {optionalFields.map(({ label, name, type }) => (
        <div key={name}>
          <label style={labelStyle}>{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            style={inputStyle}
            disabled={loading}
            placeholder={`Your ${label.replace(' URL', '')} profile URL`}
          />
        </div>
      ))}

      {/* ================= SUBMIT BUTTON ================= */}
      <button
        onClick={submitForm}
        style={submitButtonStyle}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
};

export default Apply;
