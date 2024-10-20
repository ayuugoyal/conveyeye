"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";

interface OCRResponse {
    company_name: string | null;
    manufacturing_date: string | null;
    expiry_date: string | null;
    ocr_output_image: string;
    recognized_text: string[];
}

export default function WebcamCapture() {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [apiResults, setApiResults] = useState<OCRResponse[]>([]);

    const capture = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImages((prevImages) => {
                    const newImages = [imageSrc, ...prevImages];
                    return newImages.slice(0, 9);
                });

                const blob = await fetch(imageSrc).then((res) => res.blob());

                const formData = new FormData();
                formData.append("file", blob);
                try {
                    const response = await axios.post(
                        "http://localhost:8000/extract",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    // Store the API result to display later, including the OCR output image
                    setApiResults((prevResults) => [
                        response.data,
                        ...prevResults,
                    ]);
                } catch (error) {
                    console.error("Error sending image to API:", error);
                }
            }
        }
    };

    console.log(apiResults);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isCapturing) {
            interval = setInterval(() => {
                capture();
            }, 5000); // Capture every 1 minute
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
                        Monitor Conveyors belt
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
                </Card>{" "}
            </div>

            <Card className="p-4 mt-5">
                <h2 className="text-2xl font-bold mb-4">API Results</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {apiResults.length > 0 &&
                        apiResults.map((result, index) => (
                            <Card key={index} className="p-4 mb-4">
                                <h3 className="text-lg font-bold">
                                    OCR Result {index + 1}
                                </h3>
                                <p>
                                    <strong>Company Name:</strong>{" "}
                                    {result?.company_name || "N/A"}
                                </p>
                                <p>
                                    <strong>Manufacturing Date:</strong>{" "}
                                    {result?.manufacturing_date || "N/A"}
                                </p>
                                <p>
                                    <strong>Expiry Date:</strong>{" "}
                                    {result?.recognized_text || "N/A"}
                                </p>
                                {result?.ocr_output_image && (
                                    <Image
                                        src={`data:image/jpeg;base64,${result.ocr_output_image}`}
                                        alt={`OCR Output ${index + 1}`}
                                        width={200}
                                        height={150}
                                        className="w-full h-auto rounded-lg mt-2"
                                    />
                                )}
                            </Card>
                        ))}
                </div>
            </Card>
        </div>
    );
}
