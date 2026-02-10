import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";

interface ResourceData {
  courseId: number;
  title: string;
  file?: File;
  link?: string;
  type?: string;
}

const useAddResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, title, file, link, type }: ResourceData) => {
      const formData = new FormData();
      formData.append("title", title);
      if (file) formData.append("file", file);
      if (link) formData.append("link", link);
      if (type) formData.append("type", type);

      return axiosInstance.post(`/courses/${courseId}/resources`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export default useAddResource;
