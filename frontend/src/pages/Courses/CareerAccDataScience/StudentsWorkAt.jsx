import SectionContainer from "./components/SectionContainer";

const StudentsWorkAt = () => {
  return (
    <SectionContainer bgColor="#f3f4f6">
      <div
        id="students-work-section"
        className="font-['Inter']"
      >
        <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1f2937] mb-6 lg:mb-[25px] text-center lg:text-left">
          Our Students Work At
        </h2>

        <div className="bg-white p-6 lg:p-[40px] rounded-[12px] shadow-[0_5px_20px_rgba(0,0,0,0.09)]">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-[30px]"
          >
            {[
              "/images/paytm.svg",
              "/images/EXL_Service_logo.svg",
              "/images/Optum_logo.svg",
              "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202106/tcs_logo_1200_020621101143.jpg",
              "https://enterpriseviewpoint.com/wp-content/uploads/2023/03/Ericsson-logo-1068x601.png",
              "https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Saint-Gobain_logo.svg/1200px-Saint-Gobain_logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVhmxWI9QyE6BoZ50HZ0xaaKkwYhlEJaHG3g&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzYqaoq4ACIK2yfSQSiv1PfG-aWQUuy_iIuw&s",
              "https://finshiksha.com/wp-content/uploads/2021/05/Adobe-Banner-Image.jpg",
              "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/5/59/ZS_Associates.svg",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EY_logo_2019.svg/1200px-EY_logo_2019.svg.png",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJlVYorGSkxkf-Dl0AmBXrgOa5JpV15QVymQ&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_zi1n-2qyBTEPErXlxNPmDfGVFikhBBsweQ&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYjZ4z0flEQrOr3iE11EcKbCB2uqiwpuEznQ&s",
              "https://1000logos.net/wp-content/uploads/2021/04/Fedex-logo.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1200px-PayPal_logo.svg.png",
              "https://1000logos.net/wp-content/uploads/2016/10/Bosch-Logo.png",
              "https://1000logos.net/wp-content/uploads/2017/06/Font-Samsung-Logo.jpg",
            ].map((logo, i) => (
              <div
                key={i}
                className="bg-white border border-[#e5e7eb] rounded-[8px]
                       h-[70px] lg:h-[80px] flex items-center justify-center
                       p-3 lg:p-[18px_12px] transition
                       hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]
                       hover:-translate-y-[2px]"
              >
                <img
                  src={logo}
                  alt="Company Logo"
                  className="max-h-[40px] lg:max-h-[55px] max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default StudentsWorkAt;