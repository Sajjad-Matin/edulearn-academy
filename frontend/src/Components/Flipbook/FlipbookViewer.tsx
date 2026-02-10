import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  HStack,
  Text,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface FlipbookViewerProps {
  pdfUrl: string;
  title?: string;
}

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, title }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        // For now, we'll use a simple iframe approach
        // In production, you'd use pdfjs-dist to render pages as images
        setPages([pdfUrl]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  if (loading) {
    return (
      <Center h="80vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box bg="gray.900" minH="100vh" py={8}>
      <Box maxW="1200px" mx="auto">
        {title && (
          <Text
            color="white"
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            textAlign="center"
          >
            {title}
          </Text>
        )}

        {/* Simple PDF Viewer */}
        <Box
          bg="white"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="2xl"
          h="80vh"
        >
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title={title || "PDF Viewer"}
          />
        </Box>

        {/* Controls */}
        <HStack justify="center" mt={6} spacing={4}>
          <IconButton
            aria-label="Previous page"
            icon={<ChevronLeftIcon />}
            onClick={prevPage}
            colorScheme="blue"
            size="lg"
          />
          <Text color="white" fontSize="lg">
            Page {currentPage + 1} of {pages.length}
          </Text>
          <IconButton
            aria-label="Next page"
            icon={<ChevronRightIcon />}
            onClick={nextPage}
            colorScheme="blue"
            size="lg"
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default FlipbookViewer;
