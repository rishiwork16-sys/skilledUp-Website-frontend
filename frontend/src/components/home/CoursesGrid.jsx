import { courseCategories } from '../../data/courseCategories'
export default function CoursesGrid(){
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Our Courses</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {courseCategories.map(c=> (
            <div key={c} className="p-4 bg-white rounded shadow text-center">{c}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
