import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
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
    id?: number;
    fullAddress?: string;
    postalCode?: string;
    province?: number | string;
    city?: number | string;
    neighborhood?: number | string;
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
    id?: number;
    hasCafe?: boolean;
    hasWC?: boolean;
    hasShower?: boolean;
    hasSwimmingPool?: boolean;
    hasJacuzzi?: boolean;
    hasColdPool?: boolean;
    hasLaundry?: boolean;
    hasLockerRoom?: boolean;
    hasPrivateLocker?: boolean;
  } | null;
}

const BranchDetails = () => {
  const navigate = useNavigate();
  const { id: branchIdParam } = useParams();

  const [branch, setBranch] = useState<BranchDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const customIcon = useMemo(() => {
    return new L.Icon({
      iconUrl:
        "data:image/svg+xml;base64," +
        btoa(`
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1200 1200">
          <path fill="#ff0000" d="M600,0C350.178,0,147.656,202.521,147.656,452.344 c0,83.547,16.353,169.837,63.281,232.031L600,1200l389.062-515.625c42.625-56.49,63.281-156.356,63.281-232.031 C1052.344,202.521,849.822,0,600,0z M600,261.987c105.116,0,190.356,85.241,190.356,190.356C790.356,557.46,705.116,642.7,600,642.7 s-190.356-85.24-190.356-190.356S494.884,261.987,600,261.987z"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

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
                  className="!bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  تلاش مجدد
                </button>
              )}
            </div>
          )}

          {!loading && !error && branch && (
            <div className="space-y-4">
              {/* Header and status */}
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

              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-gray-500 mb-1">تلفن</div>
                  <div className="text-black">{branch.phone || "—"}</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-gray-500 mb-1">مساحت</div>
                  <div className="text-black">
                    {typeof branch.area === "number"
                      ? `${branch.area} متر`
                      : "—"}
                  </div>
                </div>
              </div>

              {/* Address */}
              {branch.address && (
                <div className="bg-white border rounded p-4">
                  <div className="font-semibold text-gray-800 mb-3">آدرس</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>{branch.address.fullAddress || "—"}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>استان: {String(branch.address.province ?? "—")}</div>
                      <div>شهر: {String(branch.address.city ?? "—")}</div>
                      <div>
                        محله: {String(branch.address.neighborhood ?? "—")}
                      </div>
                      <div>خیابان اصلی: {branch.address.mainStreet || "—"}</div>
                      <div>خیابان: {branch.address.street || "—"}</div>
                      <div>کوچه: {branch.address.alley || "—"}</div>
                      <div>پلاک: {branch.address.flat || "—"}</div>
                      <div>کد پستی: {branch.address.postalCode || "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manager */}
              {branch.manager && (
                <div className="bg-white border rounded p-4">
                  <div className="font-semibold text-gray-800 mb-3">مدیر</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>نام: {branch.manager.firstName || "—"}</div>
                    <div>نام خانوادگی: {branch.manager.lastName || "—"}</div>
                    <div>موبایل: {branch.manager.mobile || "—"}</div>
                    <div>کد ملی: {branch.manager.nationalCode || "—"}</div>
                  </div>
                </div>
              )}

              {/* Facilities */}
              {branch.facilities && (
                <div className="bg-white border rounded p-4">
                  <div className="font-semibold text-gray-800 mb-3">
                    امکانات
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>
                      {branch.facilities.hasCafe ? "✅ کافه" : "❌ کافه"}
                    </div>
                    <div>
                      {branch.facilities.hasWC
                        ? "✅ سرویس بهداشتی"
                        : "❌ سرویس بهداشتی"}
                    </div>
                    <div>
                      {branch.facilities.hasShower ? "✅ دوش" : "❌ دوش"}
                    </div>
                    <div>
                      {branch.facilities.hasSwimmingPool
                        ? "✅ استخر"
                        : "❌ استخر"}
                    </div>
                    <div>
                      {branch.facilities.hasJacuzzi ? "✅ جکوزی" : "❌ جکوزی"}
                    </div>
                    <div>
                      {branch.facilities.hasColdPool
                        ? "✅ حوضچه آب سرد"
                        : "❌ حوضچه آب سرد"}
                    </div>
                    <div>
                      {branch.facilities.hasLaundry
                        ? "✅ خشکشویی"
                        : "❌ خشکشویی"}
                    </div>
                    <div>
                      {branch.facilities.hasLockerRoom
                        ? "✅ رختکن"
                        : "❌ رختکن"}
                    </div>
                    <div>
                      {branch.facilities.hasPrivateLocker
                        ? "✅ کمد اختصاصی"
                        : "❌ کمد اختصاصی"}
                    </div>
                  </div>
                </div>
              )}

              {/* Location map */}
              {branch.location?.coordinates &&
                branch.location.coordinates.length === 2 && (
                  <div className="bg-white border rounded p-4">
                    <div className="font-semibold text-gray-800 mb-3">
                      موقعیت
                    </div>
                    <div className="h-56 w-full rounded overflow-hidden border">
                      <MapContainer
                        center={[
                          branch.location.coordinates[1],
                          branch.location.coordinates[0],
                        ]}
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            branch.location.coordinates[1],
                            branch.location.coordinates[0],
                          ]}
                          icon={customIcon}
                        />
                      </MapContainer>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      طول: {branch.location.coordinates[0].toFixed(6)}، عرض:{" "}
                      {branch.location.coordinates[1].toFixed(6)}
                    </div>
                  </div>
                )}

              {/* Media */}
              {branch.media && branch.media.length > 0 && (
                <div className="bg-white border rounded p-4">
                  <div className="font-semibold text-gray-800 mb-3">رسانه</div>
                  <div className="grid grid-cols-2 gap-3">
                    {branch.media.map((m, idx) => (
                      <div key={idx} className="border rounded overflow-hidden">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={`media-${idx}`}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="p-3 text-sm text-gray-600">
                            بدون تصویر
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sports & Equipments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border rounded p-4">
                  <div className="font-semibold text-gray-800 mb-3">
                    رشته‌ها
                  </div>
                  {branch.sports && branch.sports.length > 0 ? (
                    <ul className="list-disc pr-5 text-sm text-gray-700">
                      {branch.sports.map((s, i) => (
                        <li key={i}>{s.name || "—"}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-500">
                      رشته‌ای ثبت نشده
                    </div>
                  )}
                </div>
                <div className="bg-white border rounded p-4">
                  <div className="font-semibold text-gray-800 mb-3">
                    تجهیزات
                  </div>
                  {branch.equipments && branch.equipments.length > 0 ? (
                    <ul className="list-disc pr-5 text-sm text-gray-700">
                      {branch.equipments.map((e, i) => (
                        <li key={i}>{e.name || "—"}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-500">
                      تجهیزاتی ثبت نشده
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="!bg-gray-100 !text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition text-sm"
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
