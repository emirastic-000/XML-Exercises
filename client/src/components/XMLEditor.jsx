import Editor from '@monaco-editor/react';

export default function XMLEditor({ defaultValue = '', onChange, height = '300px' }) {
  return (
    <div className="editor-wrapper">
      <Editor
        height={height}
        language="xml"
        theme="vs-dark"
        defaultValue={defaultValue}
        onChange={(value) => onChange && onChange(value)}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
