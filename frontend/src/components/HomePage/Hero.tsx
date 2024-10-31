import { Camera, Map, Users2Icon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

interface StatsItem {
  icon: React.ElementType;
  label: string;
}

const stats: StatsItem[] = [
  { icon: Users2Icon, label: "2500 Users" },
  { icon: Camera, label: "200 Treasures" },
  { icon: Map, label: "100 Cities" },
];


const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto space-y-6 md:space-y-0">
      <div className="md:w-1/2 lg:w-1/3 flex flex-col items-start justify-center h-full md:ml-28 lg:ml-22">
        <h1 className="text-3xl font-bold mb-3">Start Next Vacation</h1>
        <p className="text-gray-600 mb-5">
          We provide what you need to enjoy your holiday with family. Time to
          make another memorable moment.
        </p>
        <Button className="primary hover:bg-blue-700 text-white w-auto h-10 mb-8" onClick={() => navigate('/search')}>
          Show More
        </Button>

        <div className="flex justify-start space-x-8">
          {stats.map((item, index) => (
            <div key={index} className="flex items-center">
              <item.icon className="w-6 h-6 mr-2 text-gray-600" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center lg:justify-end mb-20">
        <img
          src="images/wp1846093.webp"
          alt="Cozy interior"
          className="rounded-lg w-full md:max-w-md"
        />
      </div>
    </div>
  );
};

export default HeroSection;
