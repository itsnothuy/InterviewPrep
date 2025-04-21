import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HomecardProps {
  title: string;
  content: string;
  onClick: () => void;
}

const Homecard: React.FC<HomecardProps> = ({ title, content, onClick }) => {
  return (
    <Card
      className="shadow-sm border border-slate-200 hover:bg-slate-100 hover:shadow-lg hover:border-orange-400 hover:translate-y-2 duration-75 cursor-pointer w-[320px] h-[390px] flex flex-col overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="text-center flex-none">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};

export default Homecard;
