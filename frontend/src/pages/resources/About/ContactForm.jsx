import React from 'react';

const ContactForm = ({ showForm, setShowForm, formData, handleChange, handleSubmit }) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;