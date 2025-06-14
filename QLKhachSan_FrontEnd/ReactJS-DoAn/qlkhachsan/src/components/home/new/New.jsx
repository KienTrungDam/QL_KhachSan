import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import axios from "axios";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredArticle, setFeaturedArticle] = useState(null);

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

  const sortedArticles = [...articles].sort((a, b) => b.date - a.date);
  const filteredArticles = sortedArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!loading && filteredArticles.length > 0 && !featuredArticle) {
      setFeaturedArticle(filteredArticles[0]);
    }
  }, [filteredArticles, loading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const NewsCard = React.memo(({ article, isFeature }) => (
    <div
      className={`group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
        isFeature ? "" : "flex h-32 items-stretch"
      }`}
    >
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

        {isFeature && (
          <div
            className="text-gray-600 text-base prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: article.content.replace(/\n/g, "<br />"),
            }}
          />
        )}

        {isFeature ? (
          <div className="flex items-center justify-end text-sm text-gray-500 mt-auto space-x-4">
            <span>{format(article.date, "dd/MM/yyyy")}</span>
            <span>Tác giả: {article.author}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center space-x-4">
              <span>{format(article.date, "dd/MM/yyyy")}</span>
              <span>Tác giả: {article.author}</span>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFeaturedArticle(null); // Reset lại tin chính khi tìm kiếm mới
                }}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {featuredArticle && (
                  <NewsCard article={featuredArticle} isFeature={true} />
                )}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <h2 className="bg-gray-300 font-bold pl-4 text-lg mb-4 text-gray-800 sticky top-0 z-10 py-2 border-b border-gray-400">
                  Tin mới nhất
                </h2>
                {filteredArticles
                  .filter((a) => a.id !== featuredArticle?.id)
                  .map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setFeaturedArticle(article)}
                    >
                      <NewsCard article={article} isFeature={false} />
                    </div>
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
