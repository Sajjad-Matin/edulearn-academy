import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../Services/api-service";

const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: number) => {
      const response = await axiosInstance.delete(`/resources/${resourceId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export default useDeleteResource;
