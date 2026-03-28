import React, { useMemo } from "react";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";

type Props = {
  text: string;
};

const md = markdownit({});

const Markdown = ({ text }: Props) => {
  // PERF-008 FIX: Memoize expensive markdown rendering and sanitization
  const sanitized = useMemo(() => {
    const htmlcontent = md.render(text);
    return DOMPurify.sanitize(htmlcontent);
  }, [text]);
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }}></div>;
};

export default Markdown;
