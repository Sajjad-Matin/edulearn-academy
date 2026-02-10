import {
  Box,
  Container,
  Stack,
  Text,
  HStack,
  Image,
  Divider,
  SimpleGrid,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/image.png";

const Footer = () => {
  return (
    <Box bg="slate.900" color="white" py={16} mt={20}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} mb={12}>
          <Stack spacing={6} align={{ base: "center", md: "start" }}>
            <Image
              src={logo}
              alt="EduLearn Logo"
              height="120px"
              width="auto"
              objectFit="contain"
              filter="brightness(0) invert(1)"
            />
            <Text color="slate.400" fontSize="sm">
              Empowering the next generation of tech leaders with industry-led
              education and hands-on learning.
            </Text>
          </Stack>

          <Stack spacing={4}>
            <Text fontWeight="bold" fontSize="lg">
              Platform
            </Text>
            <ChakraLink
              as={Link}
              to="/"
              color="slate.400"
              _hover={{ color: "brand.400" }}
            >
              Courses
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/register"
              color="slate.400"
              _hover={{ color: "brand.400" }}
            >
              Become a Teacher
            </ChakraLink>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              Pricing
            </ChakraLink>
          </Stack>

          <Stack spacing={4}>
            <Text fontWeight="bold" fontSize="lg">
              Company
            </Text>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              About Us
            </ChakraLink>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              Contact
            </ChakraLink>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              Privacy Policy
            </ChakraLink>
          </Stack>

          <Stack spacing={4}>
            <Text fontWeight="bold" fontSize="lg">
              Social
            </Text>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              LinkedIn
            </ChakraLink>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              Twitter
            </ChakraLink>
            <ChakraLink color="slate.400" _hover={{ color: "brand.400" }}>
              YouTube
            </ChakraLink>
          </Stack>
        </SimpleGrid>

        <Divider borderColor="slate.800" mb={8} />

        <HStack
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          spacing={4}
        >
          <Text fontSize="sm" color="slate.500">
            © 2026 Fanaven Company. All rights reserved.
          </Text>
          <HStack spacing={6}>
            <Text fontSize="xs" color="slate.600">
              Terms of Service
            </Text>
            <Text fontSize="xs" color="slate.600">
              Cookies Policy
            </Text>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default Footer;
