import { useEffect, useState } from "react";
import { getBackgrounds, createInquiry } from "../../legacy_api/home";
import { getAllCourses } from "../../legacy_api/courses";

const AssistanceForm = () => {
  const [formData, setFormData] = useState({
    step: 1,
    backgroundName: "",
    courseId: null,
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    stateName: ""
  });

  const [backgrounds, setBackgrounds] = useState([]);
  const [courses, setCourses] = useState([]);

  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [showCourseOptions, setShowCourseOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bgRes = await getBackgrounds();
      setBackgrounds(
        Array.isArray(bgRes)
          ? bgRes.map(b => b.name || b.backgroundName || b)
          : []
      );

      const courseRes = await getAllCourses();
      setCourses(courseRes || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setFormData({
      step: 1,
      backgroundName: "",
      courseId: null,
      fullName: "",
      email: "",
      mobileNumber: "",
      city: "",
      stateName: ""
    });

    setShowBackgroundOptions(false);
    setShowCourseOptions(false);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createInquiry({
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        stateName: formData.stateName,
        backgroundName: formData.backgroundName,
        courseId: formData.courseId,
        pagePath: window.location.pathname
      });

      alert("Thank you! Our expert will contact you shortly.");

      // ✅ RESET & GO BACK TO STEP 1
      resetForm();

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center
        bg-gradient-to-l from-[#B5F5ED]/30 via-[#B5F5ED]/50 to-[#B5F5ED]/20
        rounded-2xl shadow-lg border border-[#B5F5ED]/40 p-6 md:p-10 relative">

        {/* LEFT SECTION */}
        <div className="md:w-[40%] z-10">
          <h2 className="font-bold text-gray-800 text-3xl lg:text-[34px]">
            Need Assistance?
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Connect with our experts to find the best solution for your needs.
          </p>

          <div className="mt-8 flex justify-center">
            <img
              src="/images/final_need_help.png"
              alt="Need Help"
              className="w-[260px] h-[260px] object-cover rounded-full"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-[50%] w-full mt-10 md:mt-0">

          {/* STEPS */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((num, idx) => (
              <div key={num} className="flex items-center flex-1 gap-2">
                <div className="relative">
                  <div
                    className={`w-6 h-6 rounded-full ${
                      formData.step >= num ? "bg-[#26C6DA]" : "bg-gray-300"
                    } text-white flex items-center justify-center text-sm font-semibold z-10`}
                  >
                    {num}
                  </div>
                  {formData.step >= num && (
                    <div className="absolute inset-0 w-6 h-6 rounded-full bg-[#26C6DA] animate-ping opacity-20" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  formData.step >= num ? "text-[#26C6DA]" : "text-gray-500"
                }`}>
                  {["About You", "Preferences", "Details"][idx]}
                </span>
                {num !== 3 && (
                  <div className="flex-1 h-[1px] bg-gray-300 ml-3 mr-2" />
                )}
              </div>
            ))}
          </div>

          {/* FORM CARD */}
          <div className="bg-white/95 shadow-xl rounded-xl p-6 border">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* STEP 1 */}
              {formData.step === 1 && (
                <>
                  <label className="font-medium">
                    Tell us about your background?
                  </label>

                  <div className="relative">
                    <div
                      className="p-3 border rounded-lg cursor-pointer bg-white"
                      onClick={() => setShowBackgroundOptions(!showBackgroundOptions)}
                    >
                      {formData.backgroundName || "Select Background"}
                    </div>

                    {showBackgroundOptions && (
                      <div className="absolute top-full left-0 right-0 z-50 border rounded-lg max-h-56 overflow-y-auto bg-white shadow-lg mt-1">
                        {backgrounds.map(bg => (
                          <div
                            key={bg}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                              setFormData(p => ({ ...p, backgroundName: bg }));
                              setShowBackgroundOptions(false);
                            }}
                          >
                            {bg}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!formData.backgroundName}
                    onClick={() => setFormData(p => ({ ...p, step: 2 }))}
                    className="bg-[#26C6DA] text-white px-6 py-3 rounded-lg w-full disabled:opacity-60"
                  >
                    Next
                  </button>
                </>
              )}

              {/* STEP 2 */}
              {formData.step === 2 && (
                <>
                  <label className="font-medium">Select Course</label>

                  <div className="relative">
                    <div
                      className="p-3 border rounded-lg cursor-pointer bg-white"
                      onClick={() => setShowCourseOptions(!showCourseOptions)}
                    >
                      {courses.find(c => c.id === formData.courseId)?.title || "Select Course"}
                    </div>

                    {showCourseOptions && (
                      <div className="absolute top-full left-0 right-0 z-50 border rounded-lg max-h-56 overflow-y-auto bg-white shadow-lg mt-1">
                        {courses.map(course => (
                          <div
                            key={course.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                              setFormData(p => ({ ...p, courseId: course.id }));
                              setShowCourseOptions(false);
                            }}
                          >
                            {course.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, step: 1 }))}
                      className="border px-6 py-3 rounded-lg w-full"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={!formData.courseId}
                      onClick={() => setFormData(p => ({ ...p, step: 3 }))}
                      className="bg-[#26C6DA] text-white px-6 py-3 rounded-lg w-full disabled:opacity-60"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {formData.step === 3 && (
                <>
                  <input
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-lg"
                    value={formData.fullName}
                    onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                    required
                  />

                  <input
                    placeholder="Email"
                    type="email"
                    className="w-full p-3 border rounded-lg"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    required
                  />

                  <input
                    placeholder="Mobile Number"
                    className="w-full p-3 border rounded-lg"
                    value={formData.mobileNumber}
                    onChange={e =>
                      setFormData(p => ({
                        ...p,
                        mobileNumber: e.target.value.replace(/\D/g, "")
                      }))
                    }
                    required
                  />

                  <input
                    placeholder="City"
                    className="w-full p-3 border rounded-lg"
                    value={formData.city}
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    required
                  />

                  <input
                    placeholder="State"
                    className="w-full p-3 border rounded-lg"
                    value={formData.stateName}
                    onChange={e => setFormData(p => ({ ...p, stateName: e.target.value }))}
                    required
                  />

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, step: 2 }))}
                      className="border px-6 py-3 rounded-lg w-full"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#26C6DA] to-[#00BCD4]
                        text-white px-6 py-3 rounded-lg w-full"
                    >
                      {isSubmitting ? "Processing..." : "Submit"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistanceForm;