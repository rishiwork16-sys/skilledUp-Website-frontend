import React from 'react';

import VNSPic from "../../../Team Pick/VNS.png";
import AmanCPic from "../../../Team Pick/Aman C.png";
import RishuPic from "../../../Team Pick/Rishu Singh.png";
import DeepaPic from "../../../Team Pick/Deepa Vishnani.png";
import AnkitaPic from "../../../Team Pick/Ankita Rai.png";
import AbhishekPic from "../../../Team Pick/Abhishek.png";
import UtkarshPic from "../../../Team Pick/Utkarsh.png";
import AmitPic from "../../../Team Pick/Amit.png";
import RishiPic from "../../../Team Pick/Rishi Raj.png";

const TeamSection = () => {
  const leadershipTeam = [
    {
      name: 'Vijay Narayan Singh',
      role: 'Founder & Chief Executive Officer (CEO)',
      text: 'Visionary leader driving skilledUp\'s mission to make learners industry-ready through practical education, strong mentorship, and placement-focused outcomes.',
      image: VNSPic,
      linkedin: 'https://www.linkedin.com/in/ivijaynsingh/'
    },
    {
      name: 'Aman Chauhan',
      role: 'Chief Technology Officer (CTO)',
      text: 'Heads product and technology innovation, building scalable learning platforms and digital systems that power seamless learning experiences.',
      image: AmanCPic,
      linkedin: 'https://www.linkedin.com/in/theamanchauhan/'
    }
  ];

  const operationsTeam = [
    {
      name: 'Rishu Singh',
      role: 'Manager – Operations',
      text: 'Ensures smooth day-to-day operations, process efficiency, and execution excellence across training, internships, and internal workflows.',
      image: RishuPic,
      linkedin: 'https://www.linkedin.com/in/irishusingh/'
    },
    {
      name: 'Deepa Vishnani',
      role: 'Manager – Sales & Marketing',
      text: 'Drives student acquisition, brand growth, and marketing strategy with a strong focus on value-driven enrollments and market reach.',
      image: DeepaPic,
      linkedin: 'https://www.linkedin.com/in/ideepavishnani/'
    },
    {
      name: 'Ankita Rai',
      role: 'Lead – HR & Operations',
      text: 'Manages talent, culture, and internal operations while strengthening people processes, performance, engagement, and sustainable organizational growth.',
      image: AnkitaPic,
      linkedin: 'https://www.linkedin.com/in/theankitarai/'
    },
    {
      name: 'Abhishek Tripathi',
      role: 'Program Manager',
      text: 'Oversees program delivery, curriculum execution, and student success, ensuring learning outcomes meet industry standards.',
      image: AbhishekPic,
      linkedin: 'https://www.linkedin.com/in/theabhishekt/'
    }
  ];

  const engineeringTeam = [
    {
      name: 'Utkarsh Keshari',
      role: 'Lead Software Engineer',
      text: 'Leads platform development and backend architecture, ensuring reliability, performance, and scalability of skilledUp\'s tech ecosystem.',
      image: UtkarshPic,
      linkedin: 'https://www.linkedin.com/in/theutkarshkeshari/'
    },
    {
      name: 'Amit Kumar',
      role: 'Software Engineer',
      text: 'Contributes to product development, feature enhancements, and system optimization across skilledUp\'s digital platforms.',
      image: AmitPic,
      linkedin: 'https://www.linkedin.com/in/yours-amit/'
    },
    {
      name: 'Rishi Raj',
      role: 'Software Engineer',
      text: 'Supports engineering initiatives with a focus on building efficient, secure, and learner-centric technology solutions.',
      image: RishiPic,
      linkedin: 'https://www.linkedin.com/'
    }
  ];

  const TeamMember = ({ member }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col items-center text-center">
      <img
        src={member.image}
        alt={member.name}
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-4"
      />

      {/* Name + Official LinkedIn SVG */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {member.name}
        </h3>

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-full hover:opacity-80 transition"
            aria-label="LinkedIn profile"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
              alt="LinkedIn"
              className="w-5 h-5"
            />
          </a>
        )}
      </div>

      <p className="text-blue-600 font-semibold text-sm mb-3">
        {member.role}
      </p>
      <p className="text-gray-600 text-sm leading-relaxed">
        {member.text}
      </p>
    </div>
  );

  const DepartmentSection = ({ title, team, gridClass }) => (
    <div className="mb-14">
      <h3 className="text-2xl font-semibold text-blue-800 mb-6 pb-3 border-b border-gray-200">
        {title}
      </h3>

      <div className={`grid gap-6 auto-rows-fr ${gridClass}`}>
        {team.map((member, index) => (
          <TeamMember key={index} member={member} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-12 px-5 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-12 text-center">
          Meet Our Leadership & Core Team
        </h2>

        <DepartmentSection
          title="Leadership"
          team={leadershipTeam}
          gridClass="grid-cols-1 sm:grid-cols-2 justify-center"
        />

        <DepartmentSection
          title="Operations & Growth"
          team={operationsTeam}
          gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />

        <DepartmentSection
          title="Engineering & Technology"
          team={engineeringTeam}
          gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        />

        <div className="text-center mt-12">
          <p className="text-blue-800 text-xl font-semibold">
            At skilledUp, we don't just teach skills, we build careers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
