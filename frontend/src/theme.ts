import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    brand: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1", // Indigo 500
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    accent: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Amber 500
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "2xl",
        transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === "brand" ? "brand.600" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.700" : undefined,
            transform: "translateY(-1px)",
            boxShadow: "lg",
          },
          _active: {
            transform: "translateY(0)",
          },
        }),
        premium: {
          bg: "brand.600",
          color: "white",
          _hover: {
            bg: "brand.700",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.5)",
          },
          _active: {
            transform: "translateY(0)",
          },
        },
        ghost: {
          _hover: {
            bg: "brand.50",
            color: "brand.600",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "3xl",
          overflow: "hidden",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: "slate.100",
          _hover: {
            boxShadow: "2xl",
            transform: "translateY(-4px)",
            borderColor: "brand.200",
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: "xl",
            _focus: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px #818cf8",
            },
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "slate.800",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
  },
});

export default theme;
