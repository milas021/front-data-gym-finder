import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";

const CompleteInformation = () => {
  const navigate = useNavigate();
  const { id: branchIdParam } = useParams();

  type FacilitiesPayload = {
    branchId: string | number;
    hasCafe: boolean;
    hasWC: boolean;
    hasShower: boolean;
    hasSwimmingPool: boolean;
    hasJacuzzi: boolean;
    hasColdPool: boolean;
    hasLaundry: boolean;
    hasLockerRoom: boolean;
    hasPrivateLocker: boolean;
  };

  const [form, setForm] = useState<FacilitiesPayload>({
    branchId: branchIdParam || "",
    hasCafe: false,
    hasWC: false,
    hasShower: false,
    hasSwimmingPool: false,
    hasJacuzzi: false,
    hasColdPool: false,
    hasLaundry: false,
    hasLockerRoom: false,
    hasPrivateLocker: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggle = (key: keyof Omit<FacilitiesPayload, "branchId">) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!branchIdParam) {
      setError("شناسه باشگاه نامعتبر است");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const url = `https://api.milicode.ir/api/Branch/${branchIdParam}/facilities`;
      const payload: FacilitiesPayload = {
        ...form,
        branchId: form.branchId || branchIdParam,
      };
      await axios.put(url, payload, { timeout: 15000 });
      setSuccess("اطلاعات با موفقیت ذخیره شد");
    } catch (err: any) {
      if (err.response) {
        setError(`خطای سرور: ${err.response.status}`);
      } else if (err.request) {
        setError("خطای شبکه: سرور پاسخگو نیست");
      } else {
        setError(`خطا: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <HeaderComponent title="تکمیل اطلاعات باشگاه" />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          <div className="text-gray-800 font-bold">فرم تکمیل امکانات</div>

          <div className="text-gray-700 text-sm">
            شناسه باشگاه: <span className="font-mono">{branchIdParam}</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded p-2">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasCafe}
                onChange={() => handleToggle("hasCafe")}
              />
              کافه
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasWC}
                onChange={() => handleToggle("hasWC")}
              />
              سرویس بهداشتی
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasShower}
                onChange={() => handleToggle("hasShower")}
              />
              دوش
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasSwimmingPool}
                onChange={() => handleToggle("hasSwimmingPool")}
              />
              استخر
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasJacuzzi}
                onChange={() => handleToggle("hasJacuzzi")}
              />
              جکوزی
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasColdPool}
                onChange={() => handleToggle("hasColdPool")}
              />
              حوضچه آب سرد
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasLaundry}
                onChange={() => handleToggle("hasLaundry")}
              />
              خشکشویی
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasLockerRoom}
                onChange={() => handleToggle("hasLockerRoom")}
              />
              رختکن
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasPrivateLocker}
                onChange={() => handleToggle("hasPrivateLocker")}
              />
              کمد اختصاصی
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition text-sm"
              disabled={submitting}
            >
              بازگشت
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm disabled:opacity-60"
              disabled={submitting || !branchIdParam}
            >
              {submitting ? "در حال ذخیره..." : "ثبت امکانات"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CompleteInformation;
