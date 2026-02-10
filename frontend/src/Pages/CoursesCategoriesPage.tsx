import {
  Box,
  Grid,
  Heading,
  Text,
  Container,
  Flex,
  Icon,
  Stack,
  Badge,
  HStack,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiCode, FiGlobe, FiBriefcase, FiArrowRight } from "react-icons/fi";

const categories = [
  {
    id: "computer",
    title: "Computer Science",
    description:
      "Master Full-stack development, AI, Cloud Computing, and Cyber Security with industry experts.",
    icon: FiCode,
    color: "brand.600",
    bg: "brand.50",
    stats: "45+ Courses",
  },
  {
    id: "english",
    title: "Language & English",
    description:
      "Improve your communication skills, prepare for IELTS/TOEFL, or learn business English.",
    icon: FiGlobe,
    color: "accent.600",
    bg: "accent.50",
    stats: "20+ Courses",
  },
  {
    id: "business",
    title: "Business & Marketing",
    description:
      "Learn digital marketing, entrepreneurship, and management strategies to scale your career.",
    icon: FiBriefcase,
    color: "slate.700",
    bg: "slate.100",
    stats: "30+ Courses",
  },
];

const CoursesCategoriesPage = () => {
  return (
    <Box minH="100vh" pt={32} pb={20}>
      <Container maxW="7xl">
        <Stack spacing={4} mb={16} align="center" textAlign="center">
          <Badge
            colorScheme="brand"
            variant="subtle"
            rounded="full"
            px={4}
            py={1}
            textTransform="none"
            fontSize="xs"
            fontWeight="bold"
          >
            Explore Categories
          </Badge>
          <Heading
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            What do you want to{" "}
            <Text as="span" color="brand.600">
              learn today?
            </Text>
          </Heading>
          <Text color="slate.500" fontSize="lg" maxW="2xl">
            Choose from over 100+ professional courses designed to help you
            reach your maximum potential.
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={10}
        >
          {categories.map((category) => (
            <Link key={category.id} to={`/courses/${category.id}`}>
              <Box
                p={10}
                bg="white"
                border="1px solid"
                borderColor="slate.100"
                borderRadius="3xl"
                cursor="pointer"
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  shadow: "2xl",
                  transform: "translateY(-8px)",
                  borderColor: "brand.200",
                }}
                position="relative"
                overflow="hidden"
                role="group"
                h="100%"
                display="flex"
                flexDirection="column"
              >
                {/* Decorative Background Icon */}
                <Icon
                  as={category.icon}
                  position="absolute"
                  right="-20px"
                  top="-20px"
                  boxSize="150px"
                  color={category.bg}
                  zIndex={0}
                  transition="all 0.4s"
                  _groupHover={{
                    transform: "scale(1.1) rotate(-5deg)",
                    color: "brand.50",
                  }}
                />

                <Stack spacing={6} zIndex={1} flex="1">
                  <Box
                    boxSize="70px"
                    bg={category.bg}
                    color={category.color}
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.3s"
                    _groupHover={{ bg: "brand.600", color: "white" }}
                  >
                    <Icon as={category.icon} boxSize={8} />
                  </Box>

                  <Stack spacing={3}>
                    <HStack justify="space-between">
                      <Heading
                        fontSize="2xl"
                        fontWeight="800"
                        color="slate.800"
                      >
                        {category.title}
                      </Heading>
                      <Badge variant="subtle" colorScheme="gray" rounded="lg">
                        {category.stats}
                      </Badge>
                    </HStack>
                    <Text color="slate.500" fontSize="md" lineHeight="1.7">
                      {category.description}
                    </Text>
                  </Stack>
                </Stack>

                <Flex
                  mt={10}
                  fontWeight="800"
                  color="brand.600"
                  align="center"
                  gap={2}
                  fontSize="sm"
                  textTransform="uppercase"
                  letterSpacing="widest"
                >
                  Explore Sections <Icon as={FiArrowRight} />
                </Flex>
              </Box>
            </Link>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          mt={24}
          p={12}
          bg="brand.600"
          borderRadius="3xl"
          color="white"
          position="relative"
          overflow="hidden"
          textAlign="center"
        >
          <Box
            position="absolute"
            top="-50%"
            left="-10%"
            w="60%"
            h="200%"
            bg="whiteAlpha.100"
            borderRadius="full"
            filter="blur(80px)"
          />
          <Stack spacing={6} position="relative" zIndex={1} align="center">
            <Heading size="xl" fontWeight="800">
              Can't find what you're looking for?
            </Heading>
            <Text fontSize="lg" opacity={0.9} maxW="2xl">
              We are constantly adding new courses. Join our newsletter to stay
              updated on the latest additions to our platform.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="brand.600"
              _hover={{ bg: "brand.50" }}
            >
              Contact Support
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CoursesCategoriesPage;
