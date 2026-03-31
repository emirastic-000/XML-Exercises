import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

export default function LessonReader({ content }) {
  if (!content) {
    return <div className="lesson-content"><p>No content available.</p></div>;
  }

  return (
    <div className="lesson-content">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
