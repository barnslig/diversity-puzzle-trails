import { makeStyles } from "@material-ui/core";
import { BrowserQRCodeSvgWriter } from "@zxing/browser";
import * as React from "react";

const useStyle = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
  },
  code: {
    fontSize: 0,
    background: "#fff",
  },
}));

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
  const classes = useStyle();

  const codeRef = React.useRef<HTMLDivElement>(null!);
  const writer = React.useRef(new BrowserQRCodeSvgWriter());

  React.useEffect(() => {
    // Clear the div
    while (codeRef.current.firstChild) {
      codeRef.current.removeChild(codeRef.current.firstChild);
    }

    // Render the QR code
    writer.current.writeToDom(codeRef.current, contents, width, height);
  }, [contents, width, height]);

  return (
    <div className={classes.wrapper}>
      <div ref={codeRef} className={classes.code} />
    </div>
  );
};

export default QrCode;
