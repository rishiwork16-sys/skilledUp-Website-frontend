const ReviewCard = ({ review }) => (
  <div className="w-[320px] sm:w-[360px] md:w-[380px] flex-shrink-0 bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-lg flex flex-col">
    <div className="text-center flex flex-col flex-grow">
      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-4 border-blue-100">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-900">
        {review.name}
      </h3>

      <div className="flex justify-center mb-2">
        <div className="bg-white px-2 py-[2px] rounded-md border border-blue-200">
          <p className="text-blue-700 font-semibold text-xs">
            {review.company}
          </p>
        </div>
      </div>

      <blockquote className="text-gray-700 text-sm italic leading-relaxed mb-2 px-2">
        {review.review}
      </blockquote>

      <div className="flex justify-center mt-auto">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-blue-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  </div>
);

export default ReviewCard;