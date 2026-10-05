import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEjercicioProps {
  contenido: string;
}

export default function MarkdownEjercicio({ contenido }: MarkdownEjercicioProps) {
  const contenidoNormalizado = contenido.replace(/<\/?u\b[^>]*>/gi, '');

  return (
    <div className="min-w-0 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 text-xl font-semibold text-abacontex-dark first:mt-0">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-lg font-semibold text-abacontex-dark first:mt-0">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-3 mt-4 text-base font-semibold text-abacontex-dark first:mt-0">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 text-sm leading-relaxed text-abacontex-black-text last:mb-0">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-abacontex-dark">{children}</strong>
          ),

          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed">{children}</ol>
          ),

          li: ({ children }) => <li className="pl-1">{children}</li>,

          table: ({ children }) => (
            <div className="my-4 w-full max-w-full overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-max min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),

          thead: ({ children }) => <thead className="bg-abacontex-light">{children}</thead>,

          th: ({ children }) => (
            <th className="whitespace-nowrap border-b border-r border-gray-200 bg-abacontex-light px-3 py-2 text-left font-semibold text-abacontex-dark last:border-r-0">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="whitespace-nowrap border-b border-r border-gray-100 px-3 py-2 align-top text-abacontex-black-text last:border-r-0">
              {children}
            </td>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-abacontex-primary-three pl-4 text-sm italic text-abacontex-gray-text">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-5 border-gray-200" />,
        }}
      >
        {contenidoNormalizado}
      </ReactMarkdown>
    </div>
  );
}
