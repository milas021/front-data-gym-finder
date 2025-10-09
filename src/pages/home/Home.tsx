import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import axios from "axios";
import LoadingComponent from "../../shared/components/LoadingComponent";

interface Branch {
  id: string;
  name: string;
  description: string;
  phone: string;
  area: number;
  address: {
    fullAddress: string;
  };
}

const Home = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onclick = () => {
    navigate("/information");
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://api.milicode.ir/api/Branch", {
        timeout: 10000,
      });

      console.log("✅ لیست باشگاه‌ها:", response.data);
      setBranches(response.data);
    } catch (error: any) {
      console.error("❌ خطا در دریافت لیست باشگاه‌ها:", error);

      if (error.response) {
        setError(`خطای سرور: ${error.response.status}`);
      } else if (error.request) {
        setError("خطای شبکه: سرور پاسخگو نیست");
      } else {
        setError(`خطا: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleRefresh = () => {
    fetchBranches();
  };

  return (
    <Container>
      <HeaderComponent title="باشگاه‌های من" />

      <div className="p-4 space-y-6">
        {/* دکمه ثبت باشگاه جدید */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <button
            onClick={onclick}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
          >
            🏋️ ثبت باشگاه جدید
          </button>
        </div>

        {/* بخش لیست باشگاه‌ها */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">لیست باشگاه‌ها</h2>
          </div>

          {/* حالت لودینگ */}
          {loading && (
            <div className="flex flex-col">
              <div className="text-center py-8 flex justify-center items-center">
                <LoadingComponent />
              </div>

              <p className="text-gray-600 mt-2 text-center">
                در حال دریافت اطلاعات...
              </p>
            </div>
          )}

          {/* حالت خطا */}
          {error && !loading && (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-2">❌</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          {/* حالت خالی */}
          {!loading && !error && branches.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🏋️</div>
              <p className="text-gray-600">هنوز باشگاهی ثبت نکرده‌اید</p>
              <p className="text-gray-500 text-sm mt-2">
                برای شروع، باشگاه جدیدی ثبت کنید
              </p>
            </div>
          )}

          {/* نمایش لیست باشگاه‌ها */}
          {!loading && !error && branches.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {branch.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {branch.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="ml-2">📞</span>
                      <span>{branch.phone}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="ml-2">📏</span>
                      <span>مساحت: {branch.area} متر</span>
                    </div>

                    {branch.address?.fullAddress && (
                      <div className="flex items-start">
                        <span className="ml-2 mt-1">📍</span>
                        <span className="text-xs">
                          {branch.address.fullAddress}
                        </span>
                      </div>
                    )}
                  </div>

                  <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition text-sm">
                    مشاهده جزئیات
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          disabled={loading}
        >
          {loading ? "در حال بارگذاری..." : "🔄 بروزرسانی"}
        </button>
      </div>
    </Container>
  );
};

export default Home;
