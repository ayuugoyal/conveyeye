"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "./ui/button";

const WebcamCapture = () => {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc);
            if (imageSrc) {
                setImageSrc(imageSrc);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            capture();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const downloadImage = () => {
        if (imageSrc) {
            const link = document.createElement("a");
            link.href = imageSrc;
            link.download = "captured_image.jpg";
            link.click();
        }
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
            />
            {imageSrc && (
                <>
                    <Image
                        src={imageSrc}
                        alt="Captured"
                        width={640}
                        height={480}
                    />
                    <Button onClick={downloadImage}>Download Image</Button>
                </>
            )}
        </div>
    );
};

export default WebcamCapture;
