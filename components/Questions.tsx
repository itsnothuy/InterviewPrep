import { Lightbulb, Volume2Icon } from "lucide-react";

const Questions = ({ mockQuestions, activeQuestionIndex }) => {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };
  return (
    <div className="p-5 my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockQuestions &&
          mockQuestions.map((question: string, index: number) => (
            <div key={index}>
              <h2
                className={`p-2 rounded-full text-md md:text-sm sm:text-sm text-center cursor-pointer ${
                  activeQuestionIndex == index && "bg-orange-400 text-white"
                } ${activeQuestionIndex != index && "bg-secondary"}`}
              >
                Question #{index + 1}
              </h2>
            </div>
          ))}
      </div>

      <h2 className="mt-10 my-5 text-md md:text-lg">
        {mockQuestions[activeQuestionIndex]?.question}
        <Volume2Icon
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(mockQuestions[activeQuestionIndex]?.question)
          }
        />
      </h2>
      <div className="border rounded-lg p-5 bg-orange-100 my-10">
        <h2 className="flex gap-2 items-center">
          <Lightbulb />
          <strong>Notes:</strong>
        </h2>
        <h2 className="text-sm text-black my-2">
          Remember to speak clearly and stay focused on the question. This is
          your opportunity to showcase your skills and experience. Take a moment
          to organize your thoughts before responding. If you need to pause and
          think, that's okay—just as it would be in a real interview. Keep your
          answers concise but informative, highlighting key achievements and
          relevant experiences.
        </h2>
      </div>
    </div>
  );
};

export default Questions;
