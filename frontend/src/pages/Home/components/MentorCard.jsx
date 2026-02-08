const MentorCard = ({ mentor }) => (
  <div className="w-[320px] sm:w-[360px] md:w-[380px] flex-shrink-0
    bg-white/10 backdrop-blur-lg border border-white/20
    rounded-2xl p-6 flex flex-col">
    <div className="text-center flex flex-col flex-grow">
      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
        <img
          src={mentor.image}
          alt={mentor.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-bold text-white">
        {mentor.name}
      </h3>

      <p className="text-gray-300 text-sm mt-1 mb-4">
        {mentor.role}
      </p>

      <div className="flex justify-center mt-2 mb-4">
        <img
          src="/images/skilledUp Logo.png"
          alt="skilledUp"
          className="h-6 md:h-7 object-contain rounded-lg bg-white px-1 py-0.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {mentor.workExp}
          </div>
          <div className="text-xs text-gray-300">
            Years Work Experience
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {mentor.teachExp}
          </div>
          <div className="text-xs text-gray-300">
            Years Teaching Experience
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {mentor.bio}
      </p>
    </div>
  </div>
);

export default MentorCard;