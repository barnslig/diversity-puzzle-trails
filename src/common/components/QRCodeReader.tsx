import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { IScannerControls } from "@zxing/browser";
import { Result } from "@zxing/library";
import * as React from "react";
import Webcam from "react-webcam";

const useStyle = makeStyles((theme) => ({
  container: {
    height: "100%",
    left: 0,
    position: "fixed",
    top: 0,
    width: "100%",
  },
  webcam: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },
  backdrop: {
    zIndex: 0,
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
  const classes = useStyle();

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
      const { BrowserQRCodeReader } = await import("@zxing/browser");

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
  }, [webcamRef]);

  return (
    <div className={classes.container}>
      <Webcam
        className={classes.webcam}
        ref={webcamRef}
        audio={false}
        videoConstraints={{
          facingMode: "environment",
          // @ts-ignore
          torch,
        }}
      />
      <Backdrop className={classes.backdrop} open={!isReady}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default QRCodeReader;
