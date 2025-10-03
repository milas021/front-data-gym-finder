import { useState } from "react";
import Container from "../../shared/components/Container";
import HeaderComponent from "../../shared/components/HeaderComponent";
import { useProjectStore } from "../../store/store";

const Information = () => {
  const setProject = useProjectStore((state) => state.setProject);
  const nextStep = useProjectStore((state) => state.nextStep);

  const [form, setForm] = useState({
    name: "",
    description: "",
    branchName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setProject(form); // ذخیره در zustand
    nextStep(); // رفتن به مرحله بعد
  };
  return (
    <Container className="">
      <HeaderComponent title="Information" />

      <div className="p-4 space-y-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Branch Name"
          name="branchName"
          value={form.branchName}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ذخیره و ادامه
        </button>
      </div>
    </Container>
  );
};

export default Information;
