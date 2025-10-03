// Address.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";

interface AddressData {
  province: number;
  city: number;
  neighborhood: number;
  mainStreet: string;
  street: string;
  alley: string;
  flat: string;
  fullAddress: string;
}

const Address = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AddressData>({
    province: 1,
    city: 1,
    neighborhood: 1,
    mainStreet: "",
    street: "",
    alley: "",
    flat: "",
    fullAddress: "",
  });

  const [errors, setErrors] = useState<Partial<AddressData>>({});

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

  const handleSubmit = () => {
    const newErrors: Partial<AddressData> = {};

    if (!form.mainStreet.trim())
      newErrors.mainStreet = "خیابان اصلی الزامی است";
    if (!form.street.trim()) newErrors.street = "خیابان الزامی است";
    if (!form.fullAddress.trim())
      newErrors.fullAddress = "آدرس کامل الزامی است";

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    // ذخیره در localStorage یا ارسال به API
    console.log("آدرس ذخیره شد:", form);
    alert("آدرس با موفقیت ذخیره شد!");

    // رفتن به صفحه بعدی
    // navigate("/next-step");
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
            <option value={2}>البرز</option>
            <option value={3}>اصفهان</option>
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
            <option value={2}>کرج</option>
            <option value={3}>اسلامشهر</option>
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
            <option value={2}>شهرک غرب</option>
            <option value={3}>پونک</option>
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

        {/* Full Address */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="fullAddress" className="font-medium text-gray-700">
            آدرس کامل
          </label>
          <input
            id="fullAddress"
            className={`border p-2 rounded w-full ${
              errors.fullAddress ? "border-red-500" : ""
            }`}
            placeholder="آدرس کامل برای پیک"
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleChange}
          />
          {errors.fullAddress && (
            <span className="text-sm text-red-500">{errors.fullAddress}</span>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            ذخیره و ادامه
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Address;
