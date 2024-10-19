"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function WebcamCapture() {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);

    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImages((prevImages) => {
                    const newImages = [imageSrc, ...prevImages];
                    return newImages.slice(0, 9); // Keep only the 9 most recent images
                });
            }
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isCapturing) {
            interval = setInterval(() => {
                capture();
            }, 2000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCapturing]);

    const toggleCapture = () => {
        setIsCapturing((prev) => !prev);
    };

    const downloadImage = (imageSrc: string) => {
        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = `captured_image_${Date.now()}.jpg`;
        link.click();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h2 className="text-2xl font-bold mb-4">
                        Monitor Conveyers belt
                    </h2>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={640}
                        height={480}
                        className="w-full h-auto rounded-lg"
                    />
                    <div className="mt-4 flex justify-between">
                        <Button onClick={capture}>Capture the position</Button>
                        <Button
                            onClick={toggleCapture}
                            variant={isCapturing ? "destructive" : "default"}
                        >
                            {isCapturing
                                ? "Stop Monitoring"
                                : "Start Monitoring"}
                        </Button>
                    </div>
                </Card>
                <Card className="p-4">
                    <h2 className="text-2xl font-bold mb-4">
                        Monitored data from model
                    </h2>
                    <div className="grid gap-4 grid-cols-3">
                        {capturedImages.map((imageSrc, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={imageSrc}
                                    alt={`Captured ${index + 1}`}
                                    width={200}
                                    height={150}
                                    className="w-full h-auto rounded-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                                    <Button
                                        onClick={() => downloadImage(imageSrc)}
                                        size="sm"
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
