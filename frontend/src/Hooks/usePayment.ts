import { useMutation } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";
import { useToast } from "@chakra-ui/react";

const usePayment = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: (courseId: number | string) => {
      return axiosInstace.post("/payment/initiate", {
        course_id: courseId,
      });
    },
    onSuccess: (response) => {
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        toast({
          title: "Payment error",
          description: "No redirect URL received from payment gateway.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Payment initiation failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
};

export default usePayment;
