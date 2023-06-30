"use client";

interface BodyProps {
  messages: any[];
}

const Body: React.FC<BodyProps> = ({ messages }) => {
  return <div className="flex-1 overflow-y-auto">Message Body</div>;
};

export default Body;
