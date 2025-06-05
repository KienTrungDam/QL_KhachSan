import React from 'react';
import homeimage from '../../../images/home/homeimage.png';
import gioithieu from '../../../images/home/GioiThieu.mp4';

function About() {
  return (
    <>
      {/* Hình nền và chào mừng */}
      <div id="homeimage" className="relative w-full h-screen text-center text-white overflow-hidden">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .fade-in {
              animation: fadeIn 2s ease-in-out;
            }

            .dancing-script {
              font-family: 'Dancing Script', cursive;
            }

            #homeimage img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }
          `}
        </style>

        <img src={homeimage} alt="Home Background" className="absolute inset-0" />

        {/* Giới thiệu ngắn */}
        <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 text-center opacity-70">
          <h1 className="text-3xl md:text-4xl font-bold fade-in mb-4 dancing-script">
            Chào mừng đến với Sky Resort
          </h1>
          <p className="text-sm md:text-base fade-in max-w-xl mx-auto">
            Nơi bạn có thể thả hồn vào thiên nhiên, tận hưởng không gian yên bình và dịch vụ đẳng cấp.
            Hãy để chúng tôi mang đến cho bạn một kỳ nghỉ đáng nhớ tại thiên đường nghỉ dưỡng.
          </p>
        </div>
      </div>

      {/* Phần giới thiệu chi tiết */}
      <section id="about" className="bg-gray-50 py-20 px-6 text-center text-gray-800 w-4/5 mx-auto">
        <div className="w-full mx-auto">
          <p className="text-xs uppercase tracking-widest mb-6 text-gray-500">
            Cuộn xuống để khám phá thêm
          </p>

          <h2 className="text-2xl md:text-3xl font-light tracking-wider mb-6">
            Khu nghỉ dưỡng biển cao cấp tại miền Bắc Việt Nam
          </h2>

          <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-8">
            Tọa lạc tại vùng duyên hải miền Trung giàu bản sắc văn hóa của Việt Nam, Sky Resort là khu nghỉ dưỡng
            biển 5 sao cao cấp mang đến cho bạn cơ hội khám phá ba di sản thế giới được UNESCO công nhận, cùng
            những phút giây thư giãn tuyệt vời trên bãi biển đẹp nhất cả nước. Bạn sẽ có cơ hội kết nối lại với
            những người thân yêu – dù là chèo thuyền kayak trên biển Đông,hay tận hưởng những khoảnh khắc bình 
            yên trong căn biệt thự riêng biệt tại Sky Resort, Thái Bình, Việt Nam.
          </p>

          {/* Video giới thiệu */}
          <video
            className="w-full h-[80vh] mx-auto object-cover"
            src={gioithieu}
            alt="Giới thiệu Sky Resort"
            controls
            autoPlay
            loop
            muted
          />
        </div>
      </section>
    </>
  );
}

export default About;
