import { motion } from "framer-motion";
import SectionContainer from "./components/SectionContainer";

const ToolsSlider = () => {
  const tools = [
    "https://www.python.org/static/community_logos/python-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
    "https://cdn-icons-png.flaticon.com/512/942/942748.png",
    "https://cdn-icons-png.flaticon.com/512/2103/2103658.png",
    "https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/31/NumPy_logo_2020.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/22/Pandas_mark.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg",
    "https://seaborn.pydata.org/_static/logo-wide-lightbg.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8a/Plotly-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/b/b2/SCIPY_2.svg",
    "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_Platform_logo.svg",
    "https://cdn-icons-png.flaticon.com/512/4144/4144776.png",
    "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg"
  ];

  return (
    <SectionContainer bgColor="white">
      <div className="overflow-hidden">

        {/* Heading */}
        <h2 className="text-[24px] lg:text-[28px] font-bold mb-8 text-[#1f2937] text-center">
          Tools Covered
        </h2>

        {/* Slider Wrapper */}
        <div className="relative">
          <motion.div
            className="flex gap-[40px]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >

            {/* SLIDES (duplicated for infinite loop) */}
            {[...tools, ...tools].map((logo, i) => (
              <div
                key={i}
                className="
              flex items-center justify-center
              w-[185px] h-[80px]
              bg-[#f3f6ff]
              rounded-[12px]
              border border-[#e0e7ff]
              shadow-[0_4px_14px_rgba(0,0,0,0.08)]
              flex-shrink-0
            "
              >
                <img
                  src={logo}
                  alt="Tool"
                  className="max-h-[55px] max-w-[100px] object-contain"
                />
              </div>
            ))}

          </motion.div>
        </div>

      </div>
    </SectionContainer>
  );
};

export default ToolsSlider;