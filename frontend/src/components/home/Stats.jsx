import { stats } from '../../data/stats'
export default function Stats(){
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
        {stats.map(s=> (
          <div key={s.label} className="p-4 bg-white rounded shadow">
            <h3 className="text-3xl font-bold">{s.number}</h3>
            <p className="mt-1 opacity-70 text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
