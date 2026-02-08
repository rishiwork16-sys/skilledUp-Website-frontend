// src/components/FormModal.jsx
import React, { useState, useEffect } from "react";
import { getBackgrounds, createInquiry } from "../legacy_api/home";
import { getAllCourses } from "../legacy_api/courses";
import { X } from "lucide-react";

const NAVBAR_HEIGHT = 60;

const FormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    stateName: "",
    pinCode: "",
    backgroundName: "",
    courseId: ""
  });

  const [backgrounds, setBackgrounds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ================= INPUT STYLES ================= */
  const inputBase =
    "mt-1 w-full h-[36px] rounded-xl px-4 text-sm outline-none transition-all";

  const inputClass = (error) =>
    `${inputBase} border ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    } focus:ring-2 focus:border-transparent`;

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (isOpen) {
      fetchData();
      setErrors({});
      setSubmitted(false);
      document.body.style.overflow = "hidden"; // 🔒 body scroll lock
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      const bg = await getBackgrounds();
      setBackgrounds(
        Array.isArray(bg) ? bg.map(b => b.name || b.backgroundName || b) : []
      );

      const courseRes = await getAllCourses();
      setCourses(courseRes || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const e = {};
    if (!formData.fullName) e.fullName = "Full name is required";
    if (!formData.email) e.email = "Email is required";
    if (!/^[0-9]{10}$/.test(formData.mobileNumber))
      e.mobileNumber = "Enter valid 10-digit number";
    if (!formData.city) e.city = "City is required";
    if (!formData.stateName) e.stateName = "State is required";
    if (!/^[0-9]{6}$/.test(formData.pinCode))
      e.pinCode = "Enter valid 6-digit pin code";
    if (!formData.backgroundName)
      e.backgroundName = "Select your background";
    if (!formData.courseId) e.courseId = "Select a program";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await createInquiry({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        city: formData.city,
        stateName: formData.stateName,
        pinCode: formData.pinCode,
        backgroundName: formData.backgroundName,
        courseId: Number(formData.courseId),
        pagePath: window.location.pathname
      });

      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
  className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto"
  style={{ top: `${NAVBAR_HEIGHT}px` }}
>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* MODAL WRAPPER */}
      <div className="relative min-h-full flex items-start md:items-center justify-center px-3 py-6">
        <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl">

          {/* HEADER */}
          <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-3">
            <h3 className="text-lg md:text-xl font-semibold">
              Connect with Our Experts
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-5">
            {submitted ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-green-600">
                  ✅ Submitted Successfully!
                </h3>
                <p className="text-gray-600 mt-2">
                  Our career expert will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>Full Name *</label>
                    <input
                      className={inputClass(errors.fullName)}
                      value={formData.fullName}
                      onChange={e => handleChange("fullName", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Email *</label>
                    <input
                      className={inputClass(errors.email)}
                      value={formData.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>Mobile Number *</label>
                    <input
                      className={inputClass(errors.mobileNumber)}
                      value={formData.mobileNumber}
                      onChange={e =>
                        handleChange(
                          "mobileNumber",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>City *</label>
                    <input
                      className={inputClass(errors.city)}
                      value={formData.city}
                      onChange={e => handleChange("city", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>State *</label>
                    <input
                      className={inputClass(errors.stateName)}
                      value={formData.stateName}
                      onChange={e => handleChange("stateName", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Pin Code *</label>
                    <input
                      className={inputClass(errors.pinCode)}
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={e =>
                        handleChange(
                          "pinCode",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>Select Program *</label>
                    <select
                      className={inputClass(errors.courseId)}
                      value={formData.courseId}
                      onChange={e =>
                        handleChange("courseId", e.target.value)
                      }
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Your Current Background *</label>
                    <select
                      className={inputClass(errors.backgroundName)}
                      value={formData.backgroundName}
                      onChange={e =>
                        handleChange("backgroundName", e.target.value)
                      }
                    >
                      <option value="">Select background</option>
                      {backgrounds.map((bg, idx) => (
                        <option key={idx} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 text-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-8 py-2 rounded-xl text-lg text-white transition ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
