import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import { useProjectStore } from "../../store/store";

const Information = () => {
  const setProject = useProjectStore((state) => state.setProject);
  const { name, description, branchName, phone, area } = useProjectStore(
    (state) => state
  );
  const nextStep = useProjectStore((state) => state.nextStep);

  const [hasAnotherBranch, setHasAnotherBranch] = useState(!!branchName);

  const [form, setForm] = useState({
    name,
    description,
    branchName: branchName || "",
    phone,
    area: area || 0,
  });

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    phone: false,
    area: false,
    branchName: false,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setHasAnotherBranch(checked);
      if (!checked) {
        setForm({ ...form, branchName: "" });
      }
    } else if (name === "area") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = () => {
    const newErrors = {
      name: form.name.trim() === "",
      description: form.description.trim() === "",
      phone: form.phone.trim() === "",
      area: form.area <= 0,
      branchName: hasAnotherBranch && form.branchName.trim() === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;

    const projectData = {
      name: form.name,
      description: form.description,
      phone: form.phone,
      area: form.area,
      branchName: hasAnotherBranch ? form.branchName : "",
    };

    setProject(projectData);
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

  const onclickBack = () => {
    navigate("/");
  };

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

        {/* Phone */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="phone" className="font-medium text-gray-700">
            تلفن باشگاه
          </label>
          <input
            id="phone"
            type="tel"
            className={`border p-2 rounded w-full ${
              errors.phone ? "border-red-500" : ""
            }`}
            placeholder="021xxxxxxx"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">
              پر کردن این فیلد الزامی است
            </span>
          )}
        </div>

        {/* Area */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="area" className="font-medium text-gray-700">
            مساحت باشگاه (متر مربع)
          </label>
          <input
            id="area"
            type="number"
            className={`border p-2 rounded w-full ${
              errors.area ? "border-red-500" : ""
            }`}
            placeholder="150"
            name="area"
            value={form.area}
            onChange={handleChange}
            min="0"
          />
          {errors.area && (
            <span className="text-sm text-red-500">
              مساحت باید بیشتر از صفر باشد
            </span>
          )}
        </div>

        {/* Has Another Branch Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            id="hasAnotherBranch"
            type="checkbox"
            className="w-4 h-4"
            checked={hasAnotherBranch}
            onChange={handleChange}
          />
          <label
            htmlFor="hasAnotherBranch"
            className="font-medium text-gray-700"
          >
            آیا این باشگاه شعبه دیگری دارد؟
          </label>
        </div>

        {/* Branch Name - Conditional */}
        {hasAnotherBranch && (
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
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-500 w-full text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          ذخیره و ادامه
        </button>
      </div>

      <div className="flex px-4 mt-auto">
        <button
          onClick={onclickBack}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          صفحه اصلی
        </button>
      </div>
    </Container>
  );
};

export default Information;
