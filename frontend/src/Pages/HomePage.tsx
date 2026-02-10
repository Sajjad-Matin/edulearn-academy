import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  Avatar,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useCourses from "../Hooks/useCourses";
import { FiArrowRight, FiCheckCircle, FiUsers, FiClock } from "react-icons/fi";

const HomePage = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        position="relative"
        pt={{ base: 36, md: 48 }}
        pb={{ base: 20, md: 32 }}
        overflow="hidden"
      >
        <Container maxW="7xl">
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            gap={16}
          >
            <Stack spacing={8} flex="1" zIndex={1}>
              <Badge
                colorScheme="brand"
                variant="subtle"
                rounded="full"
                px={4}
                py={1}
                textTransform="none"
                fontSize="sm"
                alignSelf="flex-start"
              >
                🚀 New: Master AI Agents with our latest course
              </Badge>
              <Heading
                fontSize={{ base: "4xl", md: "7xl" }}
                fontWeight="800"
                lineHeight="1.1"
                letterSpacing="-0.02em"
              >
                Learn without <br />
                <Text as="span" color="brand.600">
                  boundaries.
                </Text>
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="slate.600"
                maxW="lg"
              >
                The ultimate platform for modern creators. Master design,
                development, and business from world-class instructors.
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Button
                  size="lg"
                  variant="premium"
                  rightIcon={<FiArrowRight />}
                  onClick={() => navigate("/register")}
                >
                  Start Learning Now
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => navigate("/categories")}
                >
                  Explore Courses
                </Button>
              </Stack>
              <HStack spacing={6} pt={4}>
                <HStack spacing={-3}>
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar
                      key={i}
                      size="sm"
                      border="2px solid white"
                      src={`https://i.pravatar.cc/150?u=${i}`}
                    />
                  ))}
                </HStack>
                <Text fontSize="sm" fontWeight="600" color="slate.500">
                  Joined by 10k+ students
                </Text>
              </HStack>
            </Stack>

            <Box
              flex="1.2"
              position="relative"
              display={{ base: "none", lg: "block" }}
            >
              <Box
                position="absolute"
                top="-40px"
                right="-40px"
                boxSize="400px"
                bg="brand.100"
                borderRadius="full"
                filter="blur(100px)"
                opacity="0.5"
                zIndex={0}
              />
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Student learning"
                borderRadius="3xl"
                shadow="2xl"
                position="relative"
                zIndex={1}
                transition="all 0.5s ease"
                _hover={{ transform: "translateY(-10px) rotate(-1deg)" }}
              />
              {/* Floating Stat Card */}
              <Box
                position="absolute"
                bottom="40px"
                left="-40px"
                bg="white"
                p={4}
                borderRadius="2xl"
                shadow="xl"
                zIndex={2}
                border="1px solid"
                borderColor="slate.100"
              >
                <HStack spacing={4}>
                  <Box bg="green.50" p={2} borderRadius="xl">
                    <Icon as={FiCheckCircle} color="green.500" boxSize={6} />
                  </Box>
                  <Box>
                    <Text fontWeight="800" fontSize="lg">
                      98%
                    </Text>
                    <Text fontSize="xs" color="slate.500">
                      Course Completion Rate
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Box py={24} bg="slate.50">
        <Container maxW="7xl">
          <Flex justify="space-between" align="flex-end" mb={12}>
            <Stack spacing={4}>
              <Text
                color="brand.600"
                fontWeight="800"
                textTransform="uppercase"
                letterSpacing="widest"
                fontSize="xs"
              >
                Top Recommendations
              </Text>
              <Heading size="2xl" fontWeight="800">
                Featured Courses
              </Heading>
            </Stack>
            <Button
              variant="link"
              colorScheme="brand"
              rightIcon={<FiArrowRight />}
              fontWeight="700"
              onClick={() => navigate("/categories")}
            >
              Browse all
            </Button>
          </Flex>

          {isLoading ? (
            <Center py={20}>
              <Spinner size="xl" thickness="4px" color="brand.500" />
            </Center>
          ) : !courses || courses.length === 0 ? (
            <Center
              py={20}
              bg="white"
              borderRadius="3xl"
              border="2px dashed"
              borderColor="slate.200"
            >
              <Stack align="center" spacing={4}>
                <Text color="slate.500" fontWeight="500">
                  No courses available at the moment.
                </Text>
                <Button variant="premium" onClick={() => navigate("/register")}>
                  Start Teaching
                </Button>
              </Stack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              {courses.slice(0, 6).map((course) => (
                <Box
                  key={course.id}
                  bg="white"
                  borderRadius="3xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="slate.100"
                  transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
                  _hover={{
                    shadow: "2xl",
                    transform: "translateY(-6px)",
                    borderColor: "brand.200",
                  }}
                  cursor="pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                  role="group"
                >
                  <Box position="relative" h="220px">
                    <Image
                      src={
                        course.thumbnail_url ||
                        `https://picsum.photos/seed/${course.id}/600/400`
                      }
                      alt={course.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      transition="transform 0.5s ease"
                      _groupHover={{ transform: "scale(1.05)" }}
                    />
                    <Badge
                      position="absolute"
                      top={4}
                      left={4}
                      bg="white"
                      color="slate.900"
                      px={3}
                      py={1}
                      rounded="full"
                      shadow="md"
                      fontSize="xs"
                      fontWeight="700"
                    >
                      {course.level?.toUpperCase()}
                    </Badge>
                  </Box>

                  <Box p={8}>
                    <Text
                      fontSize="xs"
                      fontWeight="800"
                      color="brand.600"
                      textTransform="uppercase"
                      mb={2}
                      letterSpacing="wider"
                    >
                      {course.category || "Design"}
                    </Text>
                    <Heading
                      size="md"
                      mb={4}
                      noOfLines={2}
                      fontWeight="700"
                      lineHeight="base"
                    >
                      {course.title}
                    </Heading>

                    <HStack spacing={3} mb={6}>
                      <Avatar
                        size="xs"
                        name={course.teacher?.name}
                        src={`https://ui-avatars.com/api/?name=${course.teacher?.name}&background=6366f1&color=fff`}
                      />
                      <Text fontSize="sm" fontWeight="600" color="slate.600">
                        {course.teacher?.name}
                      </Text>
                    </HStack>

                    <Flex
                      justify="space-between"
                      align="center"
                      pt={6}
                      borderTop="1px solid"
                      borderColor="slate.50"
                    >
                      <HStack spacing={4} color="slate.400">
                        <HStack spacing={1}>
                          <Icon as={FiClock} />
                          <Text fontSize="xs" fontWeight="600">
                            {course.lectures_count || 0}
                          </Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={FiUsers} />
                          <Text fontSize="xs" fontWeight="600">
                            {course.sections_count || 0}
                          </Text>
                        </HStack>
                      </HStack>
                      <Text fontWeight="800" fontSize="xl" color="brand.600">
                        {parseFloat(course.price) === 0
                          ? "Free"
                          : `${course.price} AFN`}
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Why Us Section */}
      <Box py={24}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={16}>
            <Stack spacing={6}>
              <Box
                boxSize="64px"
                bg="brand.50"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiCheckCircle} boxSize={8} color="brand.600" />
              </Box>
              <Heading size="lg" fontWeight="800">
                Expert Instruction
              </Heading>
              <Text color="slate.500" lineHeight="1.7">
                Learn from industry veterans who have worked at top-tier
                companies. Get realworld insights you won't find in textbooks.
              </Text>
            </Stack>
            <Stack spacing={6}>
              <Box
                boxSize="64px"
                bg="accent.50"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiUsers} boxSize={8} color="accent.600" />
              </Box>
              <Heading size="lg" fontWeight="800">
                Global Community
              </Heading>
              <Text color="slate.500" lineHeight="1.7">
                Join a diverse community of learners from around the world.
                Network, collaborate, and grow together in our active forums.
              </Text>
            </Stack>
            <Stack spacing={6}>
              <Box
                boxSize="64px"
                bg="slate.100"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiClock} boxSize={8} color="slate.700" />
              </Box>
              <Heading size="lg" fontWeight="800">
                Lifetime Access
              </Heading>
              <Text color="slate.500" lineHeight="1.7">
                Learn at your own pace. Once you enroll, you have access to the
                materials forever, including all future updates.
              </Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
