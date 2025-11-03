// Address.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import { useProjectStore } from "../../store/store";

interface AddressData {
  province: number;
  city: number;
  neighborhood: number;
  mainStreet: string;
  street: string;
  alley: string;
  flat: string;
  fullAddress: string;
  postalCode: string;
}

const Address = () => {
  const navigate = useNavigate();
  const setAddress = useProjectStore((state) => state.setAddress);
  const addressData = useProjectStore((state) => state.address);

  const [form, setForm] = useState<AddressData>(addressData);
  const [isFullAddressAuto, setIsFullAddressAuto] = useState(true);
  const [errors, setErrors] = useState<Partial<AddressData>>({});

  // تابع برای ساخت آدرس خودکار
  const generateFullAddress = (currentForm: AddressData): string => {
    const parts = [];

    // نام استان و شهر بر اساس value
    const provinceNames: { [key: number]: string } = {
      1: "تهران",
      2: "البرز",
      3: "اصفهان",
    };

    const cityNames: { [key: number]: string } = {
      1: "تهران",
      2: "کرج",
      3: "اسلامشهر",
    };

    const neighborhoodNames: { [key: number]: string } = {
      1: "سعادت آباد",
      2: "شهرک غرب",
      3: "پونک",
    };

    if (provinceNames[currentForm.province]) {
      parts.push(`استان ${provinceNames[currentForm.province]}`);
    }
    if (cityNames[currentForm.city]) {
      parts.push(`شهر ${cityNames[currentForm.city]}`);
    }
    if (neighborhoodNames[currentForm.neighborhood]) {
      parts.push(`محله ${neighborhoodNames[currentForm.neighborhood]}`);
    }
    if (currentForm.mainStreet) {
      parts.push(`خیابان ${currentForm.mainStreet}`);
    }
    if (currentForm.street) {
      parts.push(`کوچه ${currentForm.street}`);
    }
    if (currentForm.alley) {
      parts.push(`بن بست ${currentForm.alley}`);
    }
    if (currentForm.flat) {
      parts.push(`پلاک ${currentForm.flat}`);
    }

    return parts.join("، ");
  };

  // وقتی سایر فیلدها تغییر می‌کنند، آدرس کامل را آپدیت کن
  useEffect(() => {
    if (isFullAddressAuto) {
      const autoAddress = generateFullAddress(form);
      setForm((prev) => ({ ...prev, fullAddress: autoAddress }));
    }
  }, [
    form.province,
    form.city,
    form.neighborhood,
    form.mainStreet,
    form.street,
    form.alley,
    form.flat,
    isFullAddressAuto,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "province" || name === "city" || name === "neighborhood") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleFullAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm({ ...form, fullAddress: value });
    setIsFullAddressAuto(false); // وقتی کاربر دستی تغییر داد، auto را غیرفعال کن
  };

  const handleSubmit = () => {
    const newErrors: Partial<AddressData> = {};

    if (!form.mainStreet.trim())
      newErrors.mainStreet = "خیابان اصلی الزامی است";
    if (!form.street.trim()) newErrors.street = "خیابان الزامی است";
    if (!form.fullAddress.trim())
      newErrors.fullAddress = "آدرس کامل الزامی است";
    if (!form.postalCode.trim()) newErrors.postalCode = "کد پستی الزامی است";
    else if (form.postalCode.length !== 10)
      newErrors.postalCode = "کد پستی باید ۱۰ رقم باشد";

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    // ذخیره در store
    setAddress(form);
    alert("آدرس با موفقیت ذخیره شد!");

    navigate("/information/location");
  };

  return (
    <Container>
      <HeaderComponent title="اطلاعات آدرس" />

      <div className="p-4 space-y-4">
        {/* Province */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="province" className="font-medium text-gray-700">
            استان
          </label>
          <select
            id="province"
            className="border p-2 rounded w-full"
            name="province"
            value={form.province}
            onChange={handleChange}
          >
            <option value={1}>تهران</option>
            {/* <option value={2}>البرز</option>
            <option value={3}>اصفهان</option> */}
          </select>
        </div>

        {/* City */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="city" className="font-medium text-gray-700">
            شهر
          </label>
          <select
            id="city"
            className="border p-2 rounded w-full"
            name="city"
            value={form.city}
            onChange={handleChange}
          >
            <option value={1}>تهران</option>
            {/* <option value={2}>کرج</option> */}
            {/* <option value={3}>اسلامشهر</option> */}
          </select>
        </div>

        {/* Neighborhood */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="neighborhood" className="font-medium text-gray-700">
            محله
          </label>
          <select
            id="neighborhood"
            className="border p-2 rounded w-full"
            name="neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
          >
            <option value={1}>سعادت آباد</option>
            {/* <option value={2}>شهرک غرب</option>
            <option value={3}>پونک</option> */}
          </select>
        </div>

        {/* Main Street */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="mainStreet" className="font-medium text-gray-700">
            خیابان اصلی
          </label>
          <input
            id="mainStreet"
            className={`border p-2 rounded w-full ${
              errors.mainStreet ? "border-red-500" : ""
            }`}
            placeholder="خیابان اصلی"
            name="mainStreet"
            value={form.mainStreet}
            onChange={handleChange}
          />
          {errors.mainStreet && (
            <span className="text-sm text-red-500">{errors.mainStreet}</span>
          )}
        </div>

        {/* Street */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="street" className="font-medium text-gray-700">
            خیابان
          </label>
          <input
            id="street"
            className={`border p-2 rounded w-full ${
              errors.street ? "border-red-500" : ""
            }`}
            placeholder="خیابان"
            name="street"
            value={form.street}
            onChange={handleChange}
          />
          {errors.street && (
            <span className="text-sm text-red-500">{errors.street}</span>
          )}
        </div>

        {/* Alley */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="alley" className="font-medium text-gray-700">
            کوچه
          </label>
          <input
            id="alley"
            className="border p-2 rounded w-full"
            placeholder="کوچه"
            name="alley"
            value={form.alley}
            onChange={handleChange}
          />
        </div>

        {/* Flat */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="flat" className="font-medium text-gray-700">
            پلاک
          </label>
          <input
            id="flat"
            className="border p-2 rounded w-full"
            placeholder="پلاک"
            name="flat"
            value={form.flat}
            onChange={handleChange}
          />
        </div>

        {/* Postal Code */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="postalCode" className="font-medium text-gray-700">
            کد پستی
          </label>
          <input
            id="postalCode"
            className={`border p-2 rounded w-full ${
              errors.postalCode ? "border-red-500" : ""
            }`}
            placeholder="1234567890"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            maxLength={10}
          />
          {errors.postalCode && (
            <span className="text-sm text-red-500">{errors.postalCode}</span>
          )}
        </div>

        {/* Full Address */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="fullAddress" className="font-medium text-gray-700">
              آدرس کامل
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoAddress"
                checked={isFullAddressAuto}
                onChange={(e) => setIsFullAddressAuto(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="autoAddress" className="text-sm text-gray-600">
                تولید خودکار آدرس
              </label>
            </div>
          </div>
          <input
            id="fullAddress"
            className={`border p-2 rounded w-full ${
              errors.fullAddress ? "border-red-500" : ""
            }`}
            placeholder="آدرس کامل برای پیک"
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleFullAddressChange}
          />
          {errors.fullAddress && (
            <span className="text-sm text-red-500">{errors.fullAddress}</span>
          )}
          {isFullAddressAuto && (
            <span className="text-xs text-gray-500">
              آدرس به صورت خودکار از فیلدهای بالا تولید می‌شود
            </span>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="!bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            بازگشت
          </button>
          <button
            onClick={handleSubmit}
            className="!bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            ذخیره و ادامه
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Address;
