const WhyChooseUs = () => {
  return (
    <div className="bg-[#ffffff]">
      <section className="max-w-7xl mx-auto py-6 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-black">Why Choose skilledUp?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Career-Ready, Industry-Aligned Programs", desc: "Built on current market needs with practical skills, real-world projects, and structured interview preparation to ensure job readiness from day one." },
            { title: "Learn from Industry Experts, Not Just Trainers", desc: "Live sessions, hands-on assignments, and mentorship led by experienced professionals working on real business and data problems." },
            { title: "Outcomes That Lead to Real Placements", desc: "Strong focus on career results through dedicated placement support, hiring partnerships, and accountability-driven success metrics." },
            { title: "Flexible Learning That Fits Your Life", desc: "Choose online or offline modes with weekday or weekend batches, supported by continuous guidance without compromising learning quality." },
          ].map((f, i) => (
            <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900">{f.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;