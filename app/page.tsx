import CoursesSection from "@/components/CoursesSection";
import HeroSection from "@/components/HeroSection";
import LearningProcessSection from "@/components/LearningProcessSection";
import StudentsReviewsSection from "@/components/StudentsReviewsSection";
import VideoSamplesSection from "@/components/VideoSamplesSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import WhyUsSection from "@/components/WhyUsSection";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <WhyUsSection />
      <VisionMissionSection />
      <CoursesSection />
      <LearningProcessSection />
      <VideoSamplesSection />
      <StudentsReviewsSection />
    </div>
  );
}
