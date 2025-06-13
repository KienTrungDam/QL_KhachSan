import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import axios from "axios";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://localhost:5001/api/New");
        const raw = response.data.result || [];

        const mapped = raw.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          image: item.imageUrl
            ? `https://localhost:5001/${item.imageUrl.replace(/\\/g, "/")}`
            : "https://via.placeholder.com/400x200?text=No+Image",
          date: new Date(item.createdAt),
          author: item.author || "Không rõ",
          readingTime:
            Math.max(3, Math.floor(item.content?.split(" ").length / 50)) || 5,
        }));

        setArticles(mapped);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NewsCard = React.memo(({ article, isFeature }) => (
    <div
      className={`group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
        isFeature ? "" : "flex h-32 items-stretch"
      }`}
    >
      {/* Hình ảnh */}
      <div
        className={`${
          isFeature ? "relative h-96 w-full" : "w-32 h-full flex-shrink-0"
        } overflow-hidden`}
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Nội dung */}
      <div
        className={`${
          isFeature ? "p-6" : "p-4"
        } flex flex-col justify-between ${isFeature ? "" : "w-full"}`}
      >
        <h2
          className={`${
            isFeature ? "text-2xl" : "text-base"
          } font-bold mb-2 line-clamp-2 text-gray-800`}
        >
          {article.title}
        </h2>
        <p
          className={`text-gray-600 text-sm ${
            isFeature ? "line-clamp-3" : "line-clamp-2 h-10" // tùy chỉnh h-10/h-12 theo font-size
          }`}
        >
          {article.content}
        </p>

        {isFeature ? (
          <div className="flex items-center justify-end text-sm text-gray-500 mt-auto space-x-4">
            <span>{format(article.date, "dd/MM/yyyy")}</span>
            <span>Tác giả: {article.author}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center space-x-4">
              <span>{format(article.date, "dd/MM/yyyy")}</span>
              <div className="flex items-center">
                <span>Tác giả: {article.author}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ));

  const LoadingSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg overflow-hidden">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900">Tin Tức</h1>
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8">
              {[...Array(6)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-[70%]">
                <NewsCard article={filteredArticles[0]} isFeature={true} />
              </div>
              <div className="lg:w-[30%] space-y-4">
                {filteredArticles.slice(1, 5).map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    isFeature={false}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Không tìm thấy bài viết phù hợp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
