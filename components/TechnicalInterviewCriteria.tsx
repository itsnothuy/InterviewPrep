// // File: components/TechnicalInterviewCriteria.tsx

// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";

// interface TechnicalInterviewCriteriaProps {
//   onStart: () => void;
// }

// const TechnicalInterviewCriteria: React.FC<TechnicalInterviewCriteriaProps> = ({ onStart }) => {
//   return (
//     <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
//       <h1>Technical Interview Requirements</h1>
//       <p>
//         Before you begin, please ensure that your coding submission meets the following criteria:
//       </p>
//       <ul style={{ lineHeight: "1.6em", marginTop: "1rem" }}>
//         <li>
//           <strong>Correctness:</strong> Your solution should implement the problem accurately, producing correct results for all valid inputs. Be sure to handle edge cases appropriately.
//         </li>
//         <li>
//           <strong>Completeness:</strong> Your submitted code should be complete and self-contained. It must include everything required to compile and run your solution (for example, a complete class or method). Ideally, it should also be testable.
//         </li>
//         <li>
//           <strong>Clarity & Readability:</strong> Write clean, well-formatted code that is easy to follow. Use clear variable names, proper indentation, and provide comments where necessary to explain your logic.
//         </li>
//         <li>
//           <strong>Efficiency:</strong> Consider performance and choose an algorithm that will scale well with larger inputs. Explain any trade-offs if applicable.
//         </li>
//         <li>
//           <strong>Integration:</strong> Your solution will be evaluated using an AI tool that reviews code for correctness, clarity, and efficiency. Make sure that your answer is formatted in a way that allows for automated evaluation.
//         </li>
//       </ul>
//       <p style={{ marginTop: "1rem" }}>
//         When you are ready and have reviewed these criteria, click the button below to start your technical interview.
//       </p>
//       <Button onClick={onStart}>Start Technical Interview</Button>
//     </div>
//   );
// };

// export default TechnicalInterviewCriteria;
