import { motion } from "framer-motion";
import SectionContainer from "./components/SectionContainer";

const ToolsSlider = () => {
  const tools = [
    "/images/Apache_Spark_logo.svg",
    "https://www.python.org/static/community_logos/python-logo.png",
    "https://jupyter.org/assets/logos/rectanglelogo-greytext-orangebody-greymoons.svg",
    "/images/SCIPY_2.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/31/NumPy_logo_2020.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/22/Pandas_mark.svg",
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
  ];

  return (
    <SectionContainer bgColor="white">
      <div className="overflow-hidden">
        <h2 className="text-[24px] lg:text-[28px] font-bold mb-8 text-[#1f2937] text-center">
          Tools Covered
        </h2>

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
            {[...tools, ...tools].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-[185px] h-[80px] bg-[#f3f6ff] rounded-[12px] border border-[#e0e7ff] shadow-[0_4px_14px_rgba(0,0,0,0.08)] flex-shrink-0"
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