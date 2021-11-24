import { Box, CircularProgress } from "@mui/material";
import { BrowserQRCodeSvgWriter } from "@zxing/browser";
import * as React from "react";

type QrCodeProps = {
  /**
   * Text to encode
   */
  contents: string;

  /**
   * Width of the SVG
   */
  width?: number;

  /**
   * Height of the SVG
   */
  height?: number;
};

/**
 * A QR-Code generator
 */
const QrCode = ({ contents, width = 300, height = 300 }: QrCodeProps) => {
  const codeRef = React.useRef<HTMLDivElement>(null!);
  const writer = React.useRef<BrowserQRCodeSvgWriter>(null!);

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!writer.current) {
        const { BrowserQRCodeSvgWriter } = await import("@zxing/browser");
        writer.current = new BrowserQRCodeSvgWriter();
      }

      // Clear the div
      while (codeRef.current.firstChild) {
        codeRef.current.removeChild(codeRef.current.firstChild);
      }

      // Render the QR code
      writer.current.writeToDom(codeRef.current, contents, width, height);

      setIsReady(true);
    })();
  }, [contents, width, height]);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box ref={codeRef} sx={{ fontSize: 0, background: "#fff" }} />

      {!isReady && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width,
            height,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default QrCode;
