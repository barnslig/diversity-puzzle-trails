import { Backdrop, Box, CircularProgress } from "@mui/material";
import { IScannerControls } from "@zxing/browser";
import { Result } from "@zxing/library";
import { styled } from "@mui/material";
import * as React from "react";
import Webcam from "react-webcam";

const PREFIX = "QRCodeReader";

const classes = {
  webcam: `${PREFIX}-webcam`,
};

const StyledQRCodeReader = styled(Box)(() => ({
  height: "100%",
  left: 0,
  position: "fixed",
  top: 0,
  width: "100%",

  [`& .${classes.webcam}`]: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },
}));

type QRCodeReaderProps = {
  /**
   * Whether the device's torch is enabled. Only works on Android
   */
  torch?: boolean;

  /**
   * Event handler for when a QR code is successfully read
   */
  onResult: (result: Result) => any;
};

/**
 * A fullscreen QR code reader using the user's webcam
 */
const QRCodeReader = ({ torch = false, onResult }: QRCodeReaderProps) => {
  const webcamRef = React.useRef<Webcam>(null!);

  const controls = React.useRef<IScannerControls>(null!);

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const videoEl = webcamRef.current.video;
      if (!videoEl) {
        return;
      }

      // The zxing library is HUGE, thus we load it asynchronously
      const { BrowserQRCodeReader } = await import(
        /* webpackChunkName: "zxing" */ "@zxing/browser"
      );

      const codeReader = new BrowserQRCodeReader();
      controls.current = await codeReader.decodeFromVideoElement(
        videoEl,
        (result) => result && onResult(result)
      );

      setIsReady(true);
    })();

    return () => {
      if (controls.current) {
        controls.current.stop();
      }
    };
  }, [onResult, webcamRef]);

  React.useEffect(() => {
    if (controls.current?.switchTorch) {
      controls.current.switchTorch(torch);
    }
  }, [torch]);

  return (
    <StyledQRCodeReader>
      <Webcam
        className={classes.webcam}
        ref={webcamRef}
        audio={false}
        videoConstraints={{
          facingMode: "environment",
        }}
      />
      <Backdrop sx={{ zIndex: 0 }} open={!isReady}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </StyledQRCodeReader>
  );
};

export default QRCodeReader;
