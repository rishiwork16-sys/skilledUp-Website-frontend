import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";

export default function FAQs() {
  const faqs = [
    {
      number: "1",
      question: "What is skilledUp?",
      answer: "skilledUp is a career-driven EdTech platform offering industry-ready programs in Data Science, Data Analytics, Machine Learning, AI, Full Stack Development, and more. Our training approach focuses on practical learning, expert mentorship, and measurable outcomes to help learners build real-world skills and accelerate their careers."
    },
    {
      number: "2",
      question: "How are skilledUp courses different from others?",
      answer: "skilledUp programs follow a practical and outcome-focused structure. You receive live classes, real-world projects, 1:1 mentorship, and personalized learning paths tailored to your goals. Interview preparation starts from Day 1, and placement support continues throughout the program duration to help you develop strong, job-ready skills."
    },
    {
      number: "3",
      question: "Who are these courses suitable for?",
      answer: "These programs are suitable for learners from all backgrounds whether technical or non-technical. Each course begins from the basics, ensuring every student can understand concepts easily and progress confidently, regardless of prior experience."
    },
    {
      number: "4",
      question: "Will these courses help me get a job?",
      answer: "Yes. Our programs are designed according to current industry requirements. By actively participating in mentorship sessions, completing live projects, and following the structured curriculum, you will be well-positioned to secure relevant job opportunities."
    },
    {
      number: "5",
      question: "How is skilledUp different from other platforms?",
      answer: "skilledUp offers personalized learning, dedicated mentorship, and strong student support via calls, WhatsApp, and email. With Day 1 interview preparation and placement support during the course duration, every learner receives focused guidance and individual monitoring."
    },
    {
      number: "6",
      question: "Do you offer online and offline classes?",
      answer: "Yes. Online classes are conducted via Zoom, and offline classes are available at our Noida center located at E8, 2nd Floor, Sector 3, Noida, Uttar Pradesh, India (Near Sector 16 Metro Station)."
    },
    {
      number: "7",
      question: "Do you have a Pre-Placement Offer or Job Guarantee Offer?",
      answer: "Yes. A Pre-Placement Offer (PPO) is provided under the CareerX: Data Science & GenAI program, while a Job Guarantee is offered under the Career Accelerator: Data Science & GenAI program. Other programs offer job assistance or are job-oriented. Refer to the individual course page for full details."
    },
    {
      number: "8",
      question: "Why don't you offer Pay After Placement?",
      answer: "We avoid the 'Pay After Placement' model to prevent potential conflicts or misunderstandings. Instead, skilledUp focuses on delivering quality training, mentorship, and placement support. With consistent effort and engagement, students are expected to secure placements during or after the program."
    },
    {
      number: "9",
      question: "Do you provide internships?",
      answer: "Yes. Internships are available and include an experience letter upon successful completion. Learners work on real-time industry projects that replicate actual corporate scenarios. Earnings may be offered based on certain activities, as mentioned on the internship page."
    },
    {
      number: "10",
      question: "Is a laptop or desktop required for the courses and internship?",
      answer: "Yes. A laptop or desktop is essential for assignments, projects, practice, and accessing required software and tools effectively."
    },
    {
      number: "11",
      question: "What are the recommended specifications for a laptop or desktop?",
      answer: "We recommend at least an Intel i5 processor, 8 GB RAM, 256 GB SSD, and Windows 10 or above."
    },
    {
      number: "12",
      question: "What if my current laptop does not meet the requirements?",
      answer: "If your device is in good condition, upgrading the RAM and adding an SSD is usually sufficient rather than purchasing a new one."
    },
    {
      number: "13",
      question: "How long does it take for support to respond to my queries?",
      answer: "Most queries are resolved in real time. In exceptional cases, it may take up to 24 working hours."
    },
    {
      number: "14",
      question: "Are classes live, recorded, or both?",
      answer: "This depends on the course. If live sessions are included, content is delivered live with supporting pre-recorded materials. For paid or free pre-recorded courses, only recorded lectures will be provided."
    },
    {
      number: "15",
      question: "How often are recorded videos provided?",
      answer: "Recorded sessions are uploaded within 24 hours of each live class. Pre-recorded courses provide instant access to all videos upon enrollment."
    },
    {
    number: "16",
    question: "How can I contact the expert?",
    answer:
      "You can reach our counselors at +91\u00A0120\u00A0413\u00A01330, +91\u00A098104\u00A021790, or via email at support@skilledup.tech. A live chat option is also available on the website."
  },
    {
      number: "17",
      question: "Do the courses start from the basics?",
      answer: "Yes. All programs begin from the foundational level to ensure every learner can follow along comfortably."
    },
    {
      number: "18",
      question: "What happens if I miss a live class?",
      answer: "Recordings are uploaded within 24 hours, and you can watch them anytime on your dashboard."
    },
    {
      number: "19",
      question: "What if I have doubts while watching the recorded session?",
      answer: "The student support team will assist with doubts. However, if more than two live sessions are missed without a valid reason, additional doubt support may not be provided."
    },
    {
      number: "20",
      question: "Will the student support team help me clear backlogs?",
      answer: "Support is available for real-time and previous batch lectures but not for more than two backlog sessions."
    },
    {
      number: "21",
      question: "How long does it take to get access to my dashboard?",
      answer: "Dashboard access is provided instantly upon enrollment. If you face issues, contact support@skilledup.tech."
    },
    {
      number: "22",
      question: "Does skilledUp offer job support outside India?",
      answer: "Currently, job assurance is available only for students residing in India."
    },
    {
      number: "23",
      question: "What happens if I don't turn in my assignment or project on time?",
      answer: "Assignments may be accepted once with a valid reason. Beyond that, late submissions will not be considered. Refer to the course curriculum for details."
    },
    {
      number: "24",
      question: "Will I receive study materials with the course?",
      answer: "Yes. Notes, resources, and necessary study materials are provided throughout the program."
    },
    {
      number: "25",
      question: "Is it possible to switch from a non-tech field to tech with these courses?",
      answer: "Absolutely. Our programs begin from the basics and gradually build advanced skills, making them ideal for learners transitioning from non-technical backgrounds."
    },
    {
      number: "26",
      question: "How can I download the lectures?",
      answer: "Lecture downloading is not permitted. However, you will have access to the dashboard for sufficient duration to revisit all lessons."
    },
    {
      number: "27",
      question: "Can I manage the course if I don't live in India?",
      answer: "Yes. All sessions are recorded, and the support team is available up to 12 hours daily, making it easy to learn from any time zone."
    },
    {
      number: "28",
      question: "How does job support work?",
      answer: "Job support is provided during the program and for a specific duration afterward as per policy. Placement success depends on student engagement, consistent practice, and mentorship participation."
    },
    {
      number: "29",
      question: "How can I refer friends or family to skilledUp?",
      answer: "Each course page includes a referral option with complete details and benefits for sharing the program with others."
    },
    {
      number: "30",
      question: "I enrolled but haven't received course access. Who should I contact?",
      answer: "Please contact support@skilledup.tech for immediate assistance."
    },
    {
      number: "31",
      question: "What is the refund policy?",
      answer: "skilledUp follows a strict no-refund policy. Students are advised to review the program details and consult a counselor before enrolling."
    },
    {
      number: "32",
      question: "I don't see my course completion certificate. What should I do?",
      answer: "Certificates can be generated through the Course Analytics section once all requirements are met. For issues, email support@skilledup.tech."
    },
    {
      number: "33",
      question: "I submitted my assignments, but they are not showing as complete. Who should I contact?",
      answer: "Contact the support team at support@skilledup.tech for help."
    },
    {
      number: "34",
      question: "How can I join offline classes?",
      answer: "Visit the program page to sign up or contact +91\u00A0120\u00A0413\u00A01330 or +91\u00A098104\u00A021790."
    },
    {
      number: "35",
      question: "Do you provide any degree programs?",
      answer: "No. We provide skilledUp-certified programs only."
    },
    {
      number: "36",
      question: "I'm a working professional. Will these courses help me?",
      answer: "Yes. The programs are suitable for both students and working professionals. With 12-hour daily support and flexible learning options, professionals can manage the course alongside their job."
    }
  ];

  const currentYear = new Date().getFullYear();
  
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FAQ Content */}
      <div className="w-full flex justify-center py-10" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
        <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-8 md:p-12 leading-relaxed text-gray-800" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>

          <h1 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
            Frequently Asked Questions (FAQs)
          </h1>

          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              number={faq.number}
              question={faq.question}
              answer={faq.answer}
            />
          ))}

          {/* Inline CSS for global font application */}
          <style jsx global>{`
            body {
              font-family: 'Canva Sans', 'Open Sans', sans-serif;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Canva Sans', 'Open Sans', sans-serif;
            }
            
            p, span, div, button, a, input, textarea, select {
              font-family: 'Canva Sans', 'Open Sans', sans-serif;
            }
          `}</style>

        </div>
      </div>
    {/* Footer */}
    <Footer />
    </div>
  );
}

/* ---- Reusable FAQ Item component ---- */
function FAQItem({ number, question, answer }) {
  const formatAnswer = (text) => {
    // Convert email addresses to mailto links
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(emailRegex);
    
    return parts.map((part, index) => {
      if (emailRegex.test(part)) {
        return (
          <a 
            key={index}
            href={`mailto:${part}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
            style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="mb-6" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-0" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
        <span className="mr-2 text-black-600" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>{number}.</span>
        {question}
      </h2>
      <p className="text-gray-700" style={{ fontFamily: "'Canva Sans', 'Open Sans', sans-serif" }}>
        {formatAnswer(answer)}
      </p>
    </div>
  );
}