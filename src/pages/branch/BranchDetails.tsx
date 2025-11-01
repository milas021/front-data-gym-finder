import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import LoadingComponent from "../../shared/components/LoadingComponent";

interface BranchDetailsData {
  id?: string;
  name?: string;
  complitedData?: boolean;
  phone?: string;
  area?: number;
  location?: {
    type?: string;
    coordinates?: [number, number];
  };
  manager?: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    nationalCode?: string;
  };
  address?: {
    fullAddress?: string;
    postalCode?: string;
    province?: string;
    city?: string;
    neighborhood?: string;
    mainStreet?: string;
    street?: string;
    alley?: string;
    flat?: string;
  };
  media?: {
    image?: string;
    video?: string;
  }[];
  sports?: {
    name?: string;
    description?: string;
    image?: string;
    video?: string;
  }[];
  equipments?: {
    name?: string;
    description?: string;
    image?: string;
  }[];
  facilities?: {
    name?: string;
    description?: string;
    image?: string;
  } | null;
}

const BranchDetails = () => {
  const navigate = useNavigate();
  const { id: branchIdParam } = useParams();

  const [branch, setBranch] = useState<BranchDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranchDetails = async (branchId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.milicode.ir/api/Branch/${branchId}`,
        { timeout: 10000 }
      );

      setBranch(response.data);
    } catch (err: any) {
      if (err.response) {
        setError(`خطای سرور: ${err.response.status}`);
      } else if (err.request) {
        setError("خطای شبکه: سرور پاسخگو نیست");
      } else {
        setError(`خطا: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchIdParam) {
      fetchBranchDetails(branchIdParam);
    } else {
      setError("شناسه باشگاه نامعتبر است");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchIdParam]);
  console.log("branch", branch);
  return (
    <Container>
      <HeaderComponent title="جزئیات باشگاه" />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          {loading && (
            <div className="flex flex-col items-center py-6">
              <LoadingComponent />
              <p className="text-gray-600 mt-2">
                در حال دریافت جزئیات باشگاه...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-6">
              <div className="text-red-500 text-lg mb-2">❌</div>
              <p className="text-red-600 mb-4">{error}</p>
              {branchIdParam && (
                <button
                  onClick={() => fetchBranchDetails(branchIdParam)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  تلاش مجدد
                </button>
              )}
            </div>
          )}

          {!loading && !error && branch && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  {branch.name}
                </h2>
                <span
                  className={
                    branch.complitedData ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {branch.complitedData ? "✅ تکمیل‌شده" : "⚠️ ناقص"}
                </span>
              </div>

              <div className="text-sm text-gray-700">
                <div className="flex items-center mb-1">
                  <span className="ml-2">📞</span>
                  <span>{branch.phone || "—"}</span>
                </div>

                <div className="flex items-center mb-1">
                  <span className="ml-2">📏</span>
                  <span>
                    {typeof branch.area === "number"
                      ? `مساحت: ${branch.area} متر`
                      : "مساحت نامشخص"}
                  </span>
                </div>

                {branch.address && (
                  <div className="flex items-start">
                    <span className="ml-2 mt-1">📍</span>
                    <span className="text-xs">
                      {branch.address?.fullAddress || "—"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition text-sm"
          >
            بازگشت
          </button>

          {branchIdParam && (
            <button
              onClick={() => navigate(`/branch/${branchIdParam}/complete`)}
              className="!bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
              disabled={loading || !!error}
            >
              تکمیل اطلاعات
            </button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default BranchDetails;
