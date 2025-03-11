import CodeEditorBlock from "@/components/code-editor-block";
import { Box } from "@chakra-ui/react";

const CodeEditor = () => {
  return (
    <div className="min-h-screen p-12">
      <div className="flex flex-col items-center p-6 h-fit w-full text-center mb-20">
        <h2 className="text-6xl font-extrabold p-5 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Practice Make Perfect
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-4 p-3">
          Hone your coding skills with our interactive code editor. Whether
          you're preparing for technical interviews or just looking to sharpen
          your abilities, our platform offers the perfect environment to
          practice and improve.
        </p>
      </div>
      <CodeEditorBlock />
    </div>
  );
};
export default CodeEditor;
