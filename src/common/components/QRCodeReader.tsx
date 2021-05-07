import { makeStyles } from "@material-ui/core";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { Result } from "@zxing/library";
import * as React from "react";
import Webcam from "react-webcam";

const useStyle = makeStyles((theme) => ({
  container: {
    height: `calc(100vh - ${theme.spacing(7)}px)`,
    position: "relative",
  },
  webcam: {
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
  torch: boolean;

  /**
   * Event handler for when a QR code is successfully read
   */
  onResult: (result: Result) => any;
};

/**
 * A fullscreen QR code reader using the user's webcam
 */
const QRCodeReader = ({ torch, onResult }: QRCodeReaderProps) => {
  const classes = useStyle();

  const webcamRef = React.useRef<Webcam>(null!);

  const controls = React.useRef<IScannerControls>(null!);

  React.useEffect(() => {
    (async () => {
      const videoEl = webcamRef.current.video;
      if (!videoEl) {
        return;
      }

      const codeReader = new BrowserQRCodeReader();
      controls.current = await codeReader.decodeFromVideoElement(
        videoEl,
        (result) => result && onResult(result)
      );
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
    </div>
  );
};

export default QRCodeReader;
