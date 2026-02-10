import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";
import { useToast } from "@chakra-ui/react";

const useEnroll = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (courseId: number | string) => {
      return axiosInstace.post("/enroll", { course_id: courseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast({
        title: "Enrolled successfully!",
        description: "You can now start learning.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
};

export default useEnroll;
