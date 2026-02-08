import { Link } from 'react-router-dom'
export default function Banner(){
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20">
      <div className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Campus Se Career Tak</h1>
        <p className="opacity-90 max-w-2xl mx-auto">Industry-aligned programs, hands-on projects and mentorship to launch your career.</p>
        <div className="flex gap-4 justify-center mt-6">
          <Link to="/courses" className="px-4 py-2 bg-white text-black rounded">Explore Courses</Link>
          <Link to="/internships" className="px-4 py-2 bg-white/10 border border-white rounded">Join Internship</Link>
          <Link to="/free-courses" className="px-4 py-2 bg-transparent border border-white rounded">Book Free Demo</Link>
        </div>
      </div>
    </section>
  )
}
