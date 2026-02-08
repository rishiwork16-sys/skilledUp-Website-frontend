export default function Features(){
  const items = [
    {t:'Industry-Aligned Programs', d:'Courses built with industry experts to match real hiring needs, ensuring your skills stay relevant.'},
    {t:'Hands-On Real Work Experience', d:'Gain practical exposure through real projects, case studies, and internship-based learning.'},
    {t:'Interview Preparation from Day One', d:'Start structured interview training, assignment reviews, and skill checks from Day 1.'},
    {t:'Expert Instructors & Dedicated Mentors', d:'Learn from professionals with 1:1 mentorship for personalised guidance.'},
    {t:'PPO & Job Guarantee Pathway', d:'Unlock pre-placement offers, internship opportunities, and assured job assistance.'}
  ]
  return (
    <section className="py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-6 p-4">
      {items.map(i=> (
        <div key={i.t} className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold">{i.t}</h3>
          <p className="mt-2 text-sm opacity-80">{i.d}</p>
        </div>
      ))}
    </section>
  )
}
