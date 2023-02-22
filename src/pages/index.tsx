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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import prettier from "prettier";
import parser from "prettier/parser-babel";

import styles from "../styles/resize.module.css";
import { useRef, useState } from "react";
import { MonacoEditor } from "monaco-editor";

const CODE_FOR_TESTING = `
function pathToWriteTo(
  pathArr: string[],
  input: { [key: string]: {} },
  fs: { [key: string]: {} }
) {
  let level: { [key: string]: {} } = fs;
  let index = 0;

  for (let path of pathArr) {
    // if we are at last index(end of the pathArr), we should write the input
    if (index === pathArr.length - 1) {
      level[path] = input;
    } else {
      level = level[path];
    }
    index++;
  }
}

const target = {};
pathToWriteTo(["/"], { omg: "333" }, target);
pathToWriteTo(["/", "omg"], { wow: "2323" }, target);

console.log(JSON.stringify(target,null,2));

`;

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  const editorRef = useRef<unknown>(null);

  const monaco = editorRef?.current as MonacoEditor;

  const onFormatClick = () => {
    if (!monaco) {
      return;
    }

    // get current value from editor
    const unformatted = monaco?.getModel()?.getValue();

    if (!unformatted) {
      return;
    }

    // format that value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    // set the formatted value back in the editor
    monaco?.setValue(formatted);
  };

  function handleEditorDidMount(editor: MonacoEditor) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(monaco?.getValue());
  }

  return (
    <SandpackStack className="h-full">
      <button onClick={showValue}>Show value</button>
      <button onClick={onFormatClick}>Prettify</button>

      <FileTabs />
      <div className="flex-1 pt-2">
        {/* https://github.com/suren-atoyan/monaco-react */}
        <Editor
          onMount={handleEditorDidMount}
          width="100%"
          height="100%"
          language="typescript"
          theme="vs-light"
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value || "")}
          options={{
            // https://monaco-react.surenatoyan.com/
            minimap: {
              enabled: false,
            },
            fixedOverflowWidgets: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </SandpackStack>
  );
}

function Home() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const defaultDirection = isMobile ? "vertical" : "horizontal";

  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    defaultDirection
  );

  return (
    <>
      <div className="m-5 flex h-screen items-center justify-center overflow-hidden">
        {/* TODO: migrate to fater version?
            https://sandpack.codesandbox.io/docs/advanced-usage/bundlers
        */}
        <SandpackProvider
          // template="vanilla-ts"
          files={{
            "/index.ts": CODE_FOR_TESTING,
            "/kek.ts": `console.log('kek');`,
          }}
          // https://sandpack.codesandbox.io/docs/getting-started/usage#fully-custom-setup
          customSetup={{
            entry: "/index.ts",
            environment: "parcel",
          }}
          options={{
            recompileMode: "delayed",
            recompileDelay: 1000,
          }}
          className="w-full max-w-5xl"
        >
          <SandpackLayout
            style={{
              backgroundColor: "transparent",
              width: "100%",
              overflow: "initial",
            }}
          >
            <div className="flex h-screen w-full flex-col gap-1 sm:h-[30rem]">
              {/* https://github.com/bvaughn/react-resizable-panels */}
              <button
                onClick={() => {
                  setDirection(
                    direction === "vertical" ? "horizontal" : "vertical"
                  );
                }}
              >
                Change direction
              </button>

              <PanelGroup direction={direction} autoSaveId="code-editor">
                <Panel defaultSize={40} minSize={30} className={styles.Panel}>
                  <div className={styles.PanelContent}>
                    <MonacoEditor />
                  </div>
                </Panel>
                <ResizeHandle />
                <Panel
                  defaultSize={30}
                  minSize={20}
                  collapsible
                  className={styles.Panel}
                >
                  <div className={styles.PanelContent}>
                    <SandpackConsole />
                  </div>
                </Panel>

                {/* TODO: test component 
                    maybe create a button to show this only when needed
                    https://sandpack.codesandbox.io/docs/advanced-usage/components#sandpacktests-component
                  */}
                {/*
                 <ResizeHandle />
                 <Panel className={styles.Panel}>
                  <div className={styles.PanelContent}>
                    <SandpackTests />
                  </div>
                </Panel> */}
              </PanelGroup>
            </div>
          </SandpackLayout>
          <SandpackPreview style={{ display: "none" }} />
        </SandpackProvider>
      </div>
    </>
  );
}

function ResizeHandle({
  className = "",
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <PanelResizeHandle
      className={[styles.ResizeHandleOuter, className].join(" ")}
      id={id}
    >
      <div className={styles.ResizeHandleInner}></div>
    </PanelResizeHandle>
  );
}
export default Home;
