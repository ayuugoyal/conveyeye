import WebcamCapture from "@/components/Webcam";

export const metadata = {
    title: "Dashboard : Overview",
};

export default function page() {
    return (
        <div>
            <WebcamCapture />
        </div>
    );
}
