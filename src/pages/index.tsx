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

import styles from "../styles/resize.module.css";

const CODE_FOR_TESTING = `
// Write to the specific key of the object
// pathToWriteTo(['/', 'a'], 'myData')
// will write to -> {'/': {'a': 'myData'}}
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

  return (
    <SandpackStack className="h-full">
      <FileTabs />
      <div className="flex-1 pt-2">
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
  const isMobile = useMediaQuery("(max-width: 640px)");
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
            // environment: "parcel",
          }}
          options={{
            recompileMode: "delayed",
            recompileDelay: 1000,
          }}
          className="w-full max-w-5xl"
        >
          <SandpackLayout
            style={{ backgroundColor: "transparent", width: "100%" }}
          >
            <div className="flex h-screen w-full flex-col gap-1 sm:h-[30rem]">
              <PanelGroup
                direction={isMobile ? "vertical" : "horizontal"}
                autoSaveId="code-editor"
              >
                <Panel defaultSize={65} minSize={30} className={styles.Panel}>
                  <div className={styles.PanelContent}>
                    <MonacoEditor />
                  </div>
                </Panel>
                <ResizeHandle />
                <Panel
                  defaultSize={35}
                  minSize={20}
                  collapsible
                  className={styles.Panel}
                >
                  <div className={styles.PanelContent}>
                    <SandpackConsole />
                  </div>
                </Panel>
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
