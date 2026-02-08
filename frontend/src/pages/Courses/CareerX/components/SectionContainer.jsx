const SectionContainer = ({ children, bgColor = "white", noPadding = false, className = "" }) => (
  <section className={`w-full ${noPadding ? '' : 'py-6 md:py-6 lg:py-6'} ${bgColor}`}>
    <div className={`w-full max-w-[1350px] mx-auto px-3 sm:px-5 lg:px-5 ${className}`}>
      {children}
    </div>
  </section>
);

export default SectionContainer;