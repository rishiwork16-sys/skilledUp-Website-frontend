import { useState } from "react";

const Certificates = () => {
  const [email, setEmail] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!email) {
      setError("Please enter your registered email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // dummy API
      const response = await fetch(
        `https://api.example.com/certificates?email=${email}`
      );
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError("No certificates found for this email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎓</div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Certificate Portal
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Verify & download your course certificates
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && courses.length === 0 && !error && (
          <div className="text-center text-gray-400 py-10">
            <p>No certificates loaded yet</p>
            <p className="text-sm mt-1">
              Enter your email to fetch your certificates
            </p>
          </div>
        )}

        {/* RESULTS */}
        {courses.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">
              Your Enrolled Courses
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 bg-white shadow hover:shadow-lg transition"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {course.courseName}
                  </h4>

                  <a
                    href={course.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    📄 Download Certificate
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
