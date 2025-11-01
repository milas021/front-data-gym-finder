import { useParams } from "react-router-dom";
import Container from "../../shared/components/ContainerComponent";
import HeaderComponent from "../../shared/components/HeaderComponent";

const CompleteInformation = () => {
  const { id: branchIdParam } = useParams();

  return (
    <Container>
      <HeaderComponent title="تکمیل اطلاعات باشگاه" />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-gray-800 font-bold mb-2">فرم تکمیل اطلاعات</div>
          <p className="text-gray-700 text-sm">
            شناسه باشگاه: <span className="font-mono">{branchIdParam}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            در این صفحه فیلدهای تکمیلی هر باشگاه را پیاده‌سازی خواهیم کرد.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default CompleteInformation;
