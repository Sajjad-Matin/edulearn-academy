import { useQuery } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";
import type { Course } from "./useCourses";

const useMyCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["my-courses"],
    queryFn: () => {
      return axiosInstace.get("/my-courses").then((res) => res.data);
    },
  });
};

export default useMyCourses;
