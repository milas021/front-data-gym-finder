import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import { useProjectStore } from "../../store/store";

const Information = () => {
  const setProject = useProjectStore((state) => state.setProject);

  const { name, description, branchName } = useProjectStore((state) => state);
  const nextStep = useProjectStore((state) => state.nextStep);

  const [form, setForm] = useState({
    name,
    description,
    branchName,
  });

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    branchName: false,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = () => {
    const newErrors = {
      name: form.name.trim() === "",
      description: form.description.trim() === "",
      branchName: form.branchName.trim() === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;

    setProject(form);
    nextStep();

    // بعد از ذخیره موفق → ریدایرکت به آدرس جدید
    navigate("/information/manager");
  };

  // هندل کردن دکمه بازگشت مرورگر
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      alert(
        "⚠️ تغییرات شما ذخیره نشده است! آیا مطمئن هستید که می‌خواهید از صفحه خارج شوید؟"
      );
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
  return (
    <Container>
      <HeaderComponent title="اطلاعات اولیه " />

      <div className="p-4 space-y-4">
        {/* Name */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700">
            نام باشگاه
          </label>
          <input
            id="name"
            className={`border p-2 rounded w-full ${
              errors.name ? "border-red-500" : ""
            }`}
            placeholder="...."
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="text-sm text-red-500">
              پر کردن این فیلد الزامی است
            </span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="description" className="font-medium text-gray-700">
            توضیحات باشگاه
          </label>
          <input
            id="description"
            className={`border p-2 rounded w-full ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="باشگاه زیبا و بزرگ ...."
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="text-sm text-red-500">
              پر کردن این فیلد الزامی است
            </span>
          )}
        </div>

        {/* Branch Name */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="branchName" className="font-medium text-gray-700">
            نام شعبه
          </label>
          <input
            id="branchName"
            className={`border p-2 rounded w-full ${
              errors.branchName ? "border-red-500" : ""
            }`}
            placeholder="شعبه سعادت‌آباد"
            name="branchName"
            value={form.branchName}
            onChange={handleChange}
          />
          {errors.branchName && (
            <span className="text-sm text-red-500">
              پر کردن این فیلد الزامی است
            </span>
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

export default Information;
