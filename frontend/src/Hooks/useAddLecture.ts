import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstace from "../Services/api-service";

interface LectureData {
  sectionId: number | string;
  courseId: number | string; // To invalidate course query
  title: string;
  video_type: "file" | "youtube";
  video?: File;
  external_url?: string;
  content?: string;
  duration?: number;
  order?: number;
  is_preview?: boolean;
  onProgress?: (percent: number) => void;
}

const useAddLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LectureData) => {
      console.log("Starting lecture upload...", {
        title: data.title,
        type: data.video_type,
        size: data.video?.size,
      });

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("video_type", data.video_type);
      if (data.video) formData.append("video", data.video);
      if (data.external_url) formData.append("external_url", data.external_url);
      if (data.content) formData.append("content", data.content);
      if (data.duration) formData.append("duration", data.duration.toString());
      if (data.order) formData.append("order", data.order.toString());
      if (data.is_preview !== undefined)
        formData.append("is_preview", data.is_preview ? "1" : "0");

      return axiosInstace.post(
        `/sections/${data.sectionId}/lectures`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              console.log(`Upload progress: ${percentCompleted}%`);
              if (data.onProgress) data.onProgress(percentCompleted);
            }
          },
        },
      );
    },
    onSuccess: (_, variables) => {
      console.log("Lecture upload successful");
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
    },
  });
};

export default useAddLecture;
