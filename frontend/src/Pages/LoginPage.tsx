import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  useToast,
  Container,
  Stack,
  Flex,
  Icon,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { z } from "zod";
import useLogin from "../Hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const schema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email!" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const LoginPage = () => {
  const { mutate } = useLogin();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setErrors({});
    setLoading(true);
    mutate(parsed.data, {
      onSuccess: (data) => {
        setLoading(false);
        localStorage.setItem("token", data.access_token);
        toast({
          title: "Welcome Back!",
          description: "Successfully logged into your account.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        const role = data.user.role;
        if (role === "student") navigate("/dashboard/student");
        else if (role === "teacher") navigate("/dashboard/teacher");
        else if (role === "admin") navigate("/dashboard/admin");
      },
      onError: (error: any) => {
        setLoading(false);
        toast({
          title: "Login Failed",
          description: error?.response?.data?.message || "Invalid credentials",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      },
    });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      py={20}
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius="full"
        filter="blur(100px)"
        opacity="0.6"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="30%"
        h="30%"
        bg="accent.50"
        borderRadius="full"
        filter="blur(80px)"
        opacity="0.4"
        zIndex={0}
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <Stack spacing={8}>
          <Stack align="center" spacing={3}>
            <Heading fontSize="3xl" fontWeight="800" textAlign="center">
              Welcome Back
            </Heading>
            <Text color="slate.500" fontSize="md" textAlign="center">
              Log in to continue your learning journey
            </Text>
          </Stack>

          <Box
            bg="white"
            p={10}
            borderRadius="3xl"
            shadow="2xl"
            border="1px solid"
            borderColor="slate.100"
            backdropFilter="blur(10px)"
          >
            <Stack spacing={6}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm" fontWeight="800" color="slate.700">
                  Email Address
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="slate.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    borderRadius="xl"
                    h="50px"
                    bg="slate.50"
                    border="none"
                    _focus={{ bg: "white", shadow: "outline" }}
                  />
                </InputGroup>
                {errors.email && (
                  <Text mt={1} fontSize="xs" color="red.500">
                    {errors.email}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="sm" fontWeight="800" color="slate.700">
                  Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="slate.400" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    borderRadius="xl"
                    h="50px"
                    bg="slate.50"
                    border="none"
                    _focus={{ bg: "white", shadow: "outline" }}
                  />
                </InputGroup>
                {errors.password && (
                  <Text mt={1} fontSize="xs" color="red.500">
                    {errors.password}
                  </Text>
                )}
              </FormControl>

              <Button
                variant="premium"
                size="lg"
                h="56px"
                w="100%"
                onClick={handleSubmit}
                isLoading={loading}
                rightIcon={<FiArrowRight />}
              >
                Sign In
              </Button>

              <Flex justify="center" pt={2}>
                <Text color="slate.500" fontSize="sm">
                  Don't have an account?{" "}
                  <Link to="/register">
                    <Text
                      as="span"
                      color="brand.600"
                      fontWeight="700"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Register now
                    </Text>
                  </Link>
                </Text>
              </Flex>
            </Stack>
          </Box>

          <HStack justify="center" spacing={4} opacity={0.6}>
            <Icon as={FiCheckCircle} color="brand.500" />
            <Text fontSize="xs" fontWeight="700" color="slate.600">
              Secure AES-256 Encryption
            </Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
