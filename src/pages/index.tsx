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

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import dynamic from "next/dynamic";

import styles from "../styles/resize.module.css";
import { useEffect, useRef, useState } from "react";

// types
import type { Monaco } from "monaco-editor";
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

// lazy load editor
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  const editorRef = useRef<unknown>(null);

  const monaco = editorRef?.current as MonacoEditor;
  //    ^?

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
    if (editor) {
      editorRef.current = editor;
    }
  }

  function showValue() {
    alert(monaco?.getValue());
  }

  function handleEditorWillMount(monaco: Monaco) {
    // TODO: follow https://github.com/microsoft/monaco-editor/issues/3343
    // and https://github.com/microsoft/monaco-editor/pull/3350
    // for newer typescript support

    // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    //   target: monaco.languages.typescript.ScriptTarget.Latest,
    //   noUnusedLocals: true,
    //   noUnusedParameters: true,
    //   lib: ["dom", "dom.iterable", "esnext"],
    //   allowJs: true,
    //   checkJs: true,
    //   skipLibCheck: true,
    // });

    console.log("ts version: " + monaco.languages.typescript.typescriptVersion);
    console.log(
      monaco.languages.typescript.javascriptDefaults.getCompilerOptions()
    );
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
          beforeMount={handleEditorWillMount}
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

const DIRECTION = {
  vertical: "vertical",
  horizontal: "horizontal",
} as const;

function Home() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const defaultDirection = isMobile ? DIRECTION.vertical : DIRECTION.horizontal;

  const [direction, setDirection] =
    useState<keyof typeof DIRECTION>(defaultDirection);

  const [isClient, setClient] = useState(false);

  useEffect(() => {
    setClient(true);

    if (isMobile) {
      setDirection(DIRECTION.vertical);
    } else {
      setDirection(DIRECTION.horizontal);
    }
  }, [isMobile]);

  if (!isClient) {
    return (
      <div className="m-5 flex h-screen items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setDirection(
            direction === DIRECTION.vertical
              ? DIRECTION.horizontal
              : DIRECTION.vertical
          );
        }}
      >
        Change direction
      </button>
      <div className="m-5 flex h-screen items-center justify-center overflow-hidden">
        {/* TODO: migrate to fater version?
            https://sandpack.codesandbox.io/docs/advanced-usage/bundlers
        */}
        <SandpackProvider
          template="vanilla-ts"
          files={{
            "/index.ts": CODE_FOR_TESTING,
            "/kek.ts": `console.log('kek');`,
          }}
          // https://sandpack.codesandbox.io/docs/getting-started/usage#fully-custom-setup
          customSetup={{
            entry: "/index.ts",
            // Parcel causes some issues with TypeScript
            // environment: "parcel",
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
