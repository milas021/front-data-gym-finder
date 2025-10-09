// Location.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L, { LatLng } from "leaflet";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import { useProjectStore, type LocationData } from "../../store/store";
import axios from "axios";
import LoadingComponent from "../../shared/components/LoadingComponent";

// کامپوننت برای هندل کردن کلیک روی نقشه
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: LatLng) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

const createCustomIcon = () => {
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1200 1200">
        <path fill="#ff0000" d="M600,0C350.178,0,147.656,202.521,147.656,452.344 c0,83.547,16.353,169.837,63.281,232.031L600,1200l389.062-515.625c42.625-56.49,63.281-156.356,63.281-232.031 C1052.344,202.521,849.822,0,600,0z M600,261.987c105.116,0,190.356,85.241,190.356,190.356C790.356,557.46,705.116,642.7,600,642.7 s-190.356-85.24-190.356-190.356S494.884,261.987,600,261.987z"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// تابع برای مقایسه دو موقعیت (با دقت 6 رقم اعشار)
const isPositionChanged = (pos1: [number, number], pos2: [number, number]) => {
  return (
    Math.abs(pos1[0] - pos2[0]) > 0.000001 ||
    Math.abs(pos1[1] - pos2[1]) > 0.000001
  );
};

const Location = () => {
  const navigate = useNavigate();
  const setLocation = useProjectStore((state) => state.setLocation);
  const locationData = useProjectStore((state) => state.location);

  // موقعیت پیش‌فرض (تهران)
  const defaultPosition: [number, number] = [51.389, 35.6892];

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>(
    locationData.coordinates
  );

  const [loadingReq, setLoadingReq] = useState<boolean>(false);

  // موقعیت اولیه برای مقایسه
  const [initialPosition] = useState<[number, number]>(
    locationData.coordinates
  );

  const [customIcon] = useState(createCustomIcon());

  // آیا موقعیت تغییر کرده؟
  const hasPositionChanged = isPositionChanged(
    selectedPosition,
    initialPosition
  );

  const handleMapClick = (latlng: LatLng) => {
    const newPosition: [number, number] = [latlng.lng, latlng.lat];
    setSelectedPosition(newPosition);
  };

  //   const handleSubmit = () => {
  //   // اگر موقعیت تغییر نکرده، اجازه ثبت نده
  //   if (!hasPositionChanged) {
  //     alert("لطفاً موقعیت جدیدی روی نقشه انتخاب کنید!");
  //     return;
  //   }

  //     const locationData = {
  //       type: "Point" as const,
  //       coordinates: selectedPosition,
  //     };

  //     setLocation(locationData);
  //     alert("موقعیت جغرافیایی با موفقیت ذخیره شد!");
  //     navigate("/");
  //   };

  const handleSubmit = async () => {
    if (!hasPositionChanged) {
      alert("لطفاً موقعیت جدیدی روی نقشه انتخاب کنید!");
      return;
    }

    try {
      setLoadingReq(true);
      // آپدیت location
      const locationData: LocationData = {
        type: "Point",
        coordinates: selectedPosition,
      };
      setLocation(locationData);

      // ساخت payload
      const allData = useProjectStore.getState();
      const payload = {
        name: allData.name,
        description: allData.description,
        branchName: allData.branchName,
        phone: allData.phone,
        area: allData.area,
        manager: allData.manager,
        address: allData.address,
        location: locationData,
      };

      // ارسال درخواست
      const response = await axios.post(
        "http://api.milicode.ir/api/Gym",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ موفق:", response.data);
      alert("✅ اطلاعات باشگاه با موفقیت ثبت شد!");
      useProjectStore.getState().resetStore();
      setLoadingReq(false);

      navigate("/");
    } catch (error: any) {
      console.error("❌ خطا:", error);

      setLoadingReq(false);
      if (error.response) {
        alert(
          `❌ خطای سرور: ${error.response.status} - ${
            error.response.data?.message || "خطای ناشناخته"
          }`
        );
      } else if (error.request) {
        alert("🔒 خطای CORS/شبکه: امکان اتصال به سرور نیست");
      } else {
        alert(`❌ خطا: ${error.message}`);
      }
    }
  };

  const handleReset = () => {
    setSelectedPosition(defaultPosition);
  };

  return (
    <Container>
      <HeaderComponent title="انتخاب موقعیت جغرافیایی" />

      <div className="p-4 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">راهنما:</h3>
          <p className="text-yellow-700 text-sm">
            برای انتخاب موقعیت باشگاه، روی نقشه کلیک کنید. مارکر موقعیت انتخابی
            شما را نشان می‌دهد.
          </p>
          {!hasPositionChanged && (
            <p className="text-red-600 text-sm font-medium mt-2">
              ⚠️ لطفاً موقعیت جدیدی روی نقشه انتخاب کنید.
            </p>
          )}
        </div>

        {/* نقشه */}
        <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-300">
          <MapContainer
            center={[selectedPosition[1], selectedPosition[0]]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[selectedPosition[1], selectedPosition[0]]}
              icon={customIcon}
            >
              <Popup>
                موقعیت انتخابی باشگاه <br />
                طول جغرافیایی: {selectedPosition[0].toFixed(6)} <br />
                عرض جغرافیایی: {selectedPosition[1].toFixed(6)}
                {!hasPositionChanged && (
                  <div className="text-red-600 text-xs mt-1">
                    (موقعیت پیش‌فرض)
                  </div>
                )}
              </Popup>
            </Marker>
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
        </div>

        {/* اطلاعات موقعیت */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-medium text-gray-700">موقعیت انتخابی:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">طول جغرافیایی (Longitude):</span>
              <div className="bg-white text-black p-2 rounded">
                {selectedPosition[0].toFixed(6)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">عرض جغرافیایی (Latitude):</span>
              <div className="bg-white text-black p-2 rounded">
                {selectedPosition[1].toFixed(6)}
              </div>
            </div>
          </div>

          {/* وضعیت تغییر موقعیت */}
          <div
            className={`text-sm font-medium mt-2 ${
              hasPositionChanged ? "text-green-600" : "text-red-600"
            }`}
          >
            {hasPositionChanged
              ? "✅ موقعیت جدید انتخاب شده است"
              : "⚠️ موقعیت پیش‌فرض - لطفاً موقعیت جدیدی انتخاب کنید"}
          </div>
        </div>

        {/* دکمه‌های action */}
        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <div
              onClick={handleReset}
              className="text-black border-1 px-4 py-2 rounded hover:text-gray-600 transition cursor-pointer"
            >
              بازنشانی موقعیت
            </div>
          </div>

          <div className="w-full">
            {loadingReq ? (
              <div className="flex items-center justify-center">
                <LoadingComponent />
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasPositionChanged}
                className={`w-full px-4 py-2 rounded transition ${
                  hasPositionChanged
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "!bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {hasPositionChanged
                  ? "ذخیره موقعیت"
                  : "لطفاً موقعیت جدید انتخاب کنید"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Location;
