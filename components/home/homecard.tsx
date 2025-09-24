import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HomecardProps {
  title: string;
  content: string;
  onClick: () => void;
}

const Homecard: React.FC<HomecardProps> = ({ title, content, onClick }) => {
  return (
    <Card
      className="shadow-sm bg-gray-500/35 border border-slate-700 hover:bg-slate-700 hover:shadow-lg hover:border-orange-100/50 hover:translate-y-2 duration-75 cursor-pointer w-[320px] h-[390px] flex flex-col overflow-hidden opacity-90"
      onClick={onClick}
    >
      <CardHeader className="text-center flex-none">
        <CardTitle className="bg-hero-gradient bg-clip-text text-transparent font-bold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden text-white">
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};

export default Homecard;
