import {
  SandpackProvider,
  SandpackPreview,
  useActiveCode,
  SandpackLayout,
  SandpackStack,
  FileTabs,
  useSandpack,
  SandpackConsole,
} from "@codesandbox/sandpack-react";

import Editor from "@monaco-editor/react";

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  return (
    <SandpackStack
      style={{
        height: "50vh",
        margin: 0,
        minWidth: "500px",
      }}
    >
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8 }}>
        {/* https://github.com/suren-atoyan/monaco-react */}
        <Editor
          width="100%"
          height="100%"
          language="typescript"
          theme="vs-light"
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value || "")}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </SandpackStack>
  );
}

function Home() {
  return (
    // TODO: migrate to fater version?
    // https://sandpack.codesandbox.io/docs/advanced-usage/bundlers
    <SandpackProvider
      template="vanilla-ts"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      files={{
        "/index.ts": `console.log('Hello World')`,
      }}
      options={{
        recompileMode: "delayed",
        recompileDelay: 600,
      }}
    >
      <SandpackLayout>
        <MonacoEditor />
        <SandpackConsole style={{ height: "50vh", width: "400px" }} />
        <SandpackPreview style={{ display: "none" }} />
      </SandpackLayout>
    </SandpackProvider>
  );
}

export default Home;
