import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Stack,
  AspectRatio,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Spinner,
  Center,
  Badge,
  HStack,
  Avatar,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FiPlayCircle,
  FiFileText,
  FiClock,
  FiGlobe,
  FiChevronLeft,
  FiShare2,
  FiHeart,
  FiCheckCircle,
  FiVideo,
  FiBook,
} from "react-icons/fi";
import { useNavigate, useParams, Link } from "react-router-dom";
import useCourseDetails from "../Hooks/useCourseDetails";
import { useState } from "react";
import useEnroll from "../Hooks/useEnroll";
import useMyCourses from "../Hooks/useMyCourses";
import useAuth from "../Hooks/useAuth";
import { useToast } from "@chakra-ui/react";
import usePayment from "../Hooks/usePayment";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course, isLoading, error } = useCourseDetails(courseId!);
  const { data: myCourses } = useMyCourses();
  const { data: user } = useAuth();
  const enroll = useEnroll();
  const payment = usePayment();
  const toast = useToast();
  const [activeLecture, setActiveLecture] = useState<any>(null);

  const isEnrolled = myCourses?.some((c) => c.id === Number(courseId));

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Log in required",
        description: "Please log in to enroll in this course.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/login");
      return;
    }

    if (parseFloat(course?.price || "0") === 0) {
      enroll.mutate(courseId!);
    } else {
      payment.mutate(courseId!);
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (error || !course) {
    return (
      <Container maxW="7xl" py={32}>
        <Stack align="center" spacing={6}>
          <Text color="red.500" fontWeight="600" fontSize="lg">
            Course not found or error loading details.
          </Text>
          <Button variant="premium" onClick={() => navigate("/")}>
            Explore Other Courses
          </Button>
        </Stack>
      </Container>
    );
  }

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const currentLecture = activeLecture || course.sections[0]?.lectures[0];
  const currentVideo = currentLecture?.video_url;
  const isYouTube = currentLecture?.video_type === "youtube";

  return (
    <Box bg="slate.50" minH="100vh" pb={20}>
      {/* Cinematic Banner */}
      <Box
        bg="slate.900"
        color="white"
        pt={{ base: 36, md: 44 }}
        pb={{ base: 20, md: 32 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w="40%"
          h="120%"
          bg="brand.600"
          borderRadius="full"
          filter="blur(150px)"
          opacity="0.2"
        />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <HStack spacing={4} mb={8} color="whiteAlpha.700">
            <Link to="/">
              <Text
                fontSize="sm"
                fontWeight="600"
                _hover={{ color: "brand.300" }}
              >
                Home
              </Text>
            </Link>
            <Icon as={FiChevronLeft} boxSize={3} transform="rotate(180deg)" />
            <Link to={`/courses/${course.category?.toLowerCase() || "all"}`}>
              <Text
                fontSize="sm"
                fontWeight="600"
                _hover={{ color: "brand.300" }}
                textTransform="capitalize"
              >
                {course.category?.replace(/-/g, " ") || "Courses"}
              </Text>
            </Link>
            <Icon as={FiChevronLeft} boxSize={3} transform="rotate(180deg)" />
            <Text
              fontSize="sm"
              fontWeight="600"
              color="brand.400"
              noOfLines={1}
            >
              {course.title}
            </Text>
          </HStack>

          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={12}
            align="flex-start"
          >
            <Stack spacing={6} flex="2">
              <Badge
                colorScheme="brand"
                variant="solid"
                bg="brand.600"
                color="white"
                px={3}
                py={1}
                rounded="full"
                fontSize="xs"
                alignSelf="flex-start"
              >
                {course.level?.toUpperCase()}
              </Badge>

              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="800"
                letterSpacing="-0.02em"
                lineHeight="1.2"
              >
                {course.title}
              </Heading>

              <Text fontSize="lg" color="slate.300" maxW="3xl">
                {course.description?.substring(0, 180) ||
                  "No description available."}
                {course.description && course.description.length > 180
                  ? "..."
                  : ""}
              </Text>

              <HStack
                spacing={8}
                pt={4}
                direction={{ base: "column", sm: "row" }}
              >
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={course.teacher?.name}
                    src={`https://ui-avatars.com/api/?name=${course.teacher?.name}&background=6366f1&color=fff`}
                  />
                  <Stack spacing={0}>
                    <Text fontSize="xs" color="slate.400" fontWeight="bold">
                      Instructor
                    </Text>
                    <Text fontWeight="700">{course.teacher?.name}</Text>
                  </Stack>
                </HStack>
                <HStack spacing={6}>
                  <HStack spacing={2}>
                    <Icon as={FiPlayCircle} color="brand.400" />
                    <Text fontSize="sm" fontWeight="600">
                      {course.lectures_count || 0} Lectures
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FiGlobe} color="brand.400" />
                    <Text fontSize="sm" fontWeight="600">
                      English / Dari
                    </Text>
                  </HStack>
                </HStack>
              </HStack>
            </Stack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxW="7xl" mt="-80px">
        <Flex gap={10} direction={{ base: "column", lg: "row" }}>
          {/* Left Column: Video & curriculum */}
          <Box flex="2">
            <Stack spacing={10}>
              {/* Media Player */}
              <Box
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                shadow="2xl"
                border="1px solid"
                borderColor="slate.100"
              >
                <AspectRatio ratio={16 / 9}>
                  {currentVideo ? (
                    isYouTube ? (
                      <iframe
                        key={currentVideo}
                        src={`https://www.youtube.com/embed/${getYouTubeId(currentVideo)}?rel=0&modestbranding=1`}
                        title="Course video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ width: "100%", height: "100%" }}
                      ></iframe>
                    ) : (
                      <video
                        key={currentVideo}
                        controls
                        controlsList="nodownload"
                        poster={course.thumbnail_url}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <source src={currentVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <Center bg="slate.100" flexDirection="column" gap={4}>
                      <Icon as={FiVideo} boxSize={12} color="slate.300" />
                      <Text color="slate.500" fontWeight="600">
                        Select a lecture to start watching
                      </Text>
                    </Center>
                  )}
                </AspectRatio>

                <Box p={8}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="lg" fontWeight="800">
                      {currentLecture?.title || "Course Introduction"}
                    </Heading>
                    <HStack spacing={3}>
                      <Icon
                        as={FiShare2}
                        cursor="pointer"
                        color="slate.400"
                        _hover={{ color: "brand.600" }}
                      />
                      <Icon
                        as={FiHeart}
                        cursor="pointer"
                        color="slate.400"
                        _hover={{ color: "red.500" }}
                      />
                    </HStack>
                  </Flex>
                  <Text color="slate.600" lineHeight="1.8">
                    {currentLecture?.content ||
                      "This is a preview of the course material. Enroll now to get full access to all lectures and resources."}
                  </Text>
                </Box>
              </Box>

              {/* What You'll Learn */}
              <Box
                bg="white"
                borderRadius="3xl"
                p={10}
                border="1px solid"
                borderColor="slate.100"
                shadow="sm"
              >
                <Heading size="md" mb={8} fontWeight="800">
                  What you'll learn
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {[
                    "Master the fundamental concepts and principles.",
                    "Build real-world projects with hands-on labs.",
                    "Learn industry best practices from experts.",
                    "Get certified and boost your career potential.",
                  ].map((item, idx) => (
                    <HStack key={idx} spacing={4} align="flex-start">
                      <Icon as={FiCheckCircle} color="brand.500" mt={1} />
                      <Text color="slate.600" fontWeight="500">
                        {item}
                      </Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Curriculum */}
              <Box
                bg="white"
                borderRadius="3xl"
                p={10}
                border="1px solid"
                borderColor="slate.100"
                shadow="sm"
              >
                <Heading size="md" mb={8} fontWeight="800">
                  Course Content
                </Heading>
                <Accordion allowMultiple defaultIndex={[0]}>
                  {course.sections.map((section, sIdx) => (
                    <AccordionItem key={section.id} border="none" mb={4}>
                      <AccordionButton
                        p={5}
                        bg="slate.50"
                        borderRadius="2xl"
                        _hover={{ bg: "brand.50" }}
                        _expanded={{ bg: "brand.50", color: "brand.700" }}
                        transition="all 0.3s"
                      >
                        <Box flex="1" textAlign="left" fontWeight="800">
                          {section.title}
                        </Box>
                        <HStack spacing={4} mr={4}>
                          <Text
                            fontSize="xs"
                            fontWeight="700"
                            color="slate.400"
                          >
                            {section.lectures.length} lectures
                          </Text>
                          <AccordionIcon />
                        </HStack>
                      </AccordionButton>

                      <AccordionPanel pb={4} pt={2}>
                        <Stack spacing={1}>
                          {section.lectures.map((lecture) => (
                            <Flex
                              key={lecture.id}
                              align="center"
                              justify="space-between"
                              py={4}
                              px={6}
                              borderRadius="xl"
                              cursor="pointer"
                              transition="all 0.2s"
                              bg={
                                activeLecture?.id === lecture.id
                                  ? "brand.50"
                                  : "transparent"
                              }
                              _hover={{ bg: "brand.50" }}
                              onClick={() => {
                                if (lecture.is_preview || isEnrolled) {
                                  setActiveLecture(lecture);
                                  window.scrollTo({
                                    top: 300,
                                    behavior: "smooth",
                                  });
                                } else {
                                  toast({
                                    title: "Locked",
                                    description:
                                      "Please enroll to view this lecture.",
                                    status: "info",
                                    duration: 2000,
                                  });
                                }
                              }}
                            >
                              <HStack spacing={4}>
                                <Icon
                                  as={
                                    lecture.video_url
                                      ? FiPlayCircle
                                      : FiFileText
                                  }
                                  color={
                                    activeLecture?.id === lecture.id
                                      ? "brand.600"
                                      : "slate.400"
                                  }
                                  boxSize={5}
                                />
                                <Stack spacing={0}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight={
                                      activeLecture?.id === lecture.id
                                        ? "800"
                                        : "600"
                                    }
                                    color={
                                      activeLecture?.id === lecture.id
                                        ? "brand.800"
                                        : "slate.700"
                                    }
                                  >
                                    {lecture.title}
                                  </Text>
                                  {lecture.duration && (
                                    <Text fontSize="xs" color="slate.400">
                                      {Math.floor(lecture.duration / 60)}:
                                      {(lecture.duration % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                    </Text>
                                  )}
                                </Stack>
                              </HStack>
                              <HStack spacing={3}>
                                {lecture.is_preview && (
                                  <Badge
                                    colorScheme="green"
                                    variant="subtle"
                                    rounded="full"
                                    px={2}
                                    fontSize="10px"
                                  >
                                    Preview
                                  </Badge>
                                )}
                                {!lecture.is_preview && !isEnrolled && (
                                  <Icon
                                    as={FiClock}
                                    color="slate.300"
                                    boxSize={4}
                                  />
                                )}
                              </HStack>
                            </Flex>
                          ))}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>

              {/* Full Description */}
              <Box
                bg="white"
                borderRadius="3xl"
                p={10}
                border="1px solid"
                borderColor="slate.100"
                shadow="sm"
              >
                <Heading size="md" mb={6} fontWeight="800">
                  Full Description
                </Heading>
                <Text color="slate.600" lineHeight="1.8" whiteSpace="pre-wrap">
                  {course.description ||
                    "No full description provided for this course."}
                </Text>
              </Box>
            </Stack>
          </Box>

          {/* Right Column: Sidebar */}
          <Box flex="0.8">
            <Box
              position="sticky"
              top="120px"
              bg="white"
              borderRadius="3xl"
              p={8}
              border="1px solid"
              borderColor="slate.100"
              shadow="2xl"
            >
              <Box borderRadius="2xl" overflow="hidden" mb={8} shadow="md">
                <Image
                  src={
                    course.thumbnail_url ||
                    `https://picsum.photos/seed/${course.id}/600/400`
                  }
                  alt={course.title}
                />
              </Box>

              <Stack spacing={6}>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="800"
                    color="slate.400"
                    textTransform="uppercase"
                    letterSpacing="widest"
                    mb={1}
                  >
                    Full Course Access
                  </Text>
                  <HStack align="baseline" spacing={2}>
                    <Text fontWeight="800" fontSize="4xl" color="slate.900">
                      {parseFloat(course.price) === 0
                        ? "Free"
                        : `${course.price} AFN`}
                    </Text>
                    {parseFloat(course.price) !== 0 && (
                      <Text
                        color="slate.400"
                        textDecoration="line-through"
                        fontWeight="600"
                      >
                        {parseFloat(course.price) * 1.5} AFN
                      </Text>
                    )}
                  </HStack>
                </Box>

                <Stack spacing={4}>
                  {isEnrolled ? (
                    <Button
                      variant="premium"
                      size="lg"
                      h="60px"
                      onClick={() => navigate("/dashboard/student")}
                    >
                      Go to Learning Dashboard
                    </Button>
                  ) : (
                    <Button
                      variant="premium"
                      size="lg"
                      h="60px"
                      onClick={handleEnroll}
                      isLoading={enroll.isPending || payment.isPending}
                    >
                      {parseFloat(course?.price || "0") === 0
                        ? "Enroll Now"
                        : "Buy Lifetime Access"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    h="60px"
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor="slate.100"
                    _hover={{ bg: "slate.50" }}
                  >
                    Share Course
                  </Button>
                </Stack>

                <Stack spacing={4} pt={4}>
                  <Text
                    fontWeight="800"
                    fontSize="xs"
                    color="slate.400"
                    textTransform="uppercase"
                  >
                    Included in this course
                  </Text>
                  <Stack spacing={3}>
                    <HStack spacing={3}>
                      <Icon as={FiVideo} color="brand.600" />
                      <Text fontSize="sm" fontWeight="600" color="slate.700">
                        {course.lectures_count || 0} Hours on-demand video
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiBook} color="brand.600" />
                      <Text fontSize="sm" fontWeight="600" color="slate.700">
                        12 Downloadable resources
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiClock} color="brand.600" />
                      <Text fontSize="sm" fontWeight="600" color="slate.700">
                        Full lifetime access
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiGlobe} color="brand.600" />
                      <Text fontSize="sm" fontWeight="600" color="slate.700">
                        Access on mobile and TV
                      </Text>
                    </HStack>
                  </Stack>
                </Stack>

                <Divider borderColor="slate.100" />

                <Stack spacing={4}>
                  <Text
                    fontWeight="800"
                    fontSize="xs"
                    color="slate.400"
                    textTransform="uppercase"
                  >
                    Your Instructor
                  </Text>
                  <HStack spacing={4}>
                    <Avatar
                      size="md"
                      name={course.teacher?.name}
                      src={`https://ui-avatars.com/api/?name=${course.teacher?.name}&background=6366f1&color=fff`}
                    />
                    <Stack spacing={0}>
                      <Text fontWeight="800" color="slate.900">
                        {course.teacher?.name}
                      </Text>
                      <Text fontSize="xs" color="slate.500" fontWeight="600">
                        Senior Web Architect
                      </Text>
                    </Stack>
                  </HStack>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CourseDetailsPage;
