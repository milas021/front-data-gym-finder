import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";
import LoadingComponent from "../../shared/components/LoadingComponent";

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
  const [facilitiesError, setFacilitiesError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleToggle = (key: keyof Omit<FacilitiesPayload, "branchId">) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!branchIdParam) {
      setFacilitiesError("شناسه باشگاه نامعتبر است");
      return;
    }
    setSubmitting(true);
    setFacilitiesError(null);
    setMediaError(null);
    setMessage(null);
    try {
      const url = `https://api.milicode.ir/api/Branch/${branchIdParam}/facilities`;
      const payload: FacilitiesPayload = {
        ...form,
        branchId: form.branchId || branchIdParam,
      };
      await axios.put(url, payload, { timeout: 15000 });
      // If images selected, upload to media endpoint next
      if (imageFiles.length > 0) {
        const mediaUrl = `https://api.milicode.ir/api/Branch/${branchIdParam}/media`;
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("file", file);
        });
        try {
          await axios.put(mediaUrl, formData, {
            timeout: 20000,
            headers: { "Content-Type": "multipart/form-data" },
          });
          setMessage(
            `امکانات ذخیره شد و ${imageFiles.length} تصویر با موفقیت بارگذاری شد`
          );
        } catch (err: any) {
          if (err.response) {
            setMediaError(
              `خطا در بارگذاری تصویر (media): ${err.response.status}`
            );
          } else if (err.request) {
            setMediaError("خطا در بارگذاری تصویر (media): سرور پاسخگو نیست");
          } else {
            setMediaError(`خطا در بارگذاری تصویر (media): ${err.message}`);
          }
          setMessage("امکانات ذخیره شد، اما بارگذاری تصویر(ها) ناموفق بود");
        }
      } else {
        setMessage("امکانات با موفقیت ذخیره شد");
      }
    } catch (err: any) {
      if (err.response) {
        setFacilitiesError(
          `خطا در ذخیره امکانات (facilities): ${err.response.status}`
        );
      } else if (err.request) {
        setFacilitiesError(
          "خطا در ذخیره امکانات (facilities): سرور پاسخگو نیست"
        );
      } else {
        setFacilitiesError(`خطا در ذخیره امکانات (facilities): ${err.message}`);
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

          {facilitiesError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-2">
              {facilitiesError}
            </div>
          )}
          {mediaError && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded p-2">
              {mediaError}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded p-2">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasCafe}
                onChange={() => handleToggle("hasCafe")}
              />
              کافه
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasWC}
                onChange={() => handleToggle("hasWC")}
              />
              سرویس بهداشتی
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasShower}
                onChange={() => handleToggle("hasShower")}
              />
              دوش
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasSwimmingPool}
                onChange={() => handleToggle("hasSwimmingPool")}
              />
              استخر
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasJacuzzi}
                onChange={() => handleToggle("hasJacuzzi")}
              />
              جکوزی
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasColdPool}
                onChange={() => handleToggle("hasColdPool")}
              />
              حوضچه آب سرد
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.hasLaundry}
                onChange={() => handleToggle("hasLaundry")}
              />
              خشکشویی
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-800 mb-2">
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

          {/* Image upload section */}
          <div className="space-y-2 border-t pt-4">
            <div className="text-gray-800 font-semibold mb-5">آپلود تصویر</div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setImageFiles(files);
              }}
              className="cursor-pointer block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              disabled={submitting}
            />
            {imageFiles.length > 0 && (
              <ul className="text-xs text-gray-600 space-y-1">
                {imageFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="!text-red-600 hover:underline ml-2"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-600 text-right">
              توضیحات تصویر: سایز تصویر باید بیشتر از 1000x1000 باشد. مثلا
            </p>
          </div>

          <div className="flex gap-2 pt-5">
            {submitting ? (
              <div className="flex items-center justify-center">
                <LoadingComponent />
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="!bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition text-sm"
                  disabled={submitting}
                >
                  بازگشت
                </button>
                <button
                  onClick={handleSubmit}
                  className="!bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm disabled:opacity-60"
                  disabled={submitting || !branchIdParam}
                >
                  {submitting ? "در حال ذخیره..." : "تأیید و ثبت"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CompleteInformation;
