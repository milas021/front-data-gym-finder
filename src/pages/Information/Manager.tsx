import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import { useProjectStore } from "../../store/store";

const Manager = () => {
  const setManager = useProjectStore((state) => state.setManager);
  const nextStep = useProjectStore((state) => state.nextStep);

  const managerData = useProjectStore((state) => state.manager);
  const navigate = useNavigate();

  const [form, setForm] = useState(managerData);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    nationalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // فقط عدد برای mobile و nationalCode
    if ((name === "mobile" || name === "nationalCode") && value !== "") {
      if (!/^[0-9]*$/.test(value)) return; // فقط عدد
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {
      firstName: form.firstName.trim() === "" ? "نام الزامی است" : "",
      lastName: form.lastName.trim() === "" ? "نام خانوادگی الزامی است" : "",
      mobile:
        form.mobile.trim() === ""
          ? "شماره موبایل الزامی است"
          : form.mobile.length !== 11
          ? "شماره موبایل باید ۱۱ رقم باشد"
          : "",
      nationalCode:
        form.nationalCode.trim() === ""
          ? "کد ملی الزامی است"
          : form.nationalCode.length !== 10
          ? "کد ملی باید ۱۰ رقم باشد"
          : "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    setManager(form);
    nextStep();

    navigate("/information/address");
  };

  return (
    <Container>
      <HeaderComponent title=" اطلاعات مدیریت " />

      <div className="p-4 space-y-4">
        {/* First Name */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="firstName" className="font-medium text-gray-700">
            نام مدیر
          </label>
          <input
            id="firstName"
            className={`border p-2 rounded w-full ${
              errors.firstName ? "border-red-500" : ""
            }`}
            placeholder="نام مدیر"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="text-sm text-red-500">{errors.firstName}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="lastName" className="font-medium text-gray-700">
            نام خانوادگی مدیر
          </label>
          <input
            id="lastName"
            className={`border p-2 rounded w-full ${
              errors.lastName ? "border-red-500" : ""
            }`}
            placeholder="نام خانوادگی مدیر"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <span className="text-sm text-red-500">{errors.lastName}</span>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="mobile" className="font-medium text-gray-700">
            شماره موبایل
          </label>
          <input
            id="mobile"
            type="tel"
            className={`border p-2 rounded w-full ${
              errors.mobile ? "border-red-500" : ""
            }`}
            placeholder="0912xxxxxxx"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            maxLength={11}
          />
          {errors.mobile && (
            <span className="text-sm text-red-500">{errors.mobile}</span>
          )}
        </div>

        {/* National Code */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="nationalCode" className="font-medium text-gray-700">
            کد ملی
          </label>
          <input
            id="nationalCode"
            className={`border p-2 rounded w-full ${
              errors.nationalCode ? "border-red-500" : ""
            }`}
            placeholder="کد ملی مدیر"
            name="nationalCode"
            value={form.nationalCode}
            onChange={handleChange}
            maxLength={10}
          />
          {errors.nationalCode && (
            <span className="text-sm text-red-500">{errors.nationalCode}</span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          ذخیره و ادامه
        </button>
      </div>
    </Container>
  );
};

export default Manager;
