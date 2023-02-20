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
      <div className="mx-10 flex h-screen items-center justify-center overflow-x-hidden">
        <SandpackProvider
          // template="vanilla-ts"
          files={{
            "/index.ts": `console.log('Hello World');`,
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
          className="w-full max-w-3xl"
        >
          <div className="h-screen sm:h-80 ">
            <PanelGroup direction={"horizontal"} autoSaveId="code-editor">
              <SandpackLayout
                style={{ backgroundColor: "transparent", width: "100%" }}
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
              </SandpackLayout>
            </PanelGroup>
          </div>
          <SandpackPreview style={{ display: "none" }} />
        </SandpackProvider>
      </div>

      {/* // TODO: migrate to fater version?
    // https://sandpack.codesandbox.io/docs/advanced-usage/bundlers */}
      {/* <SandpackProvider
        // template="vanilla-ts"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        files={{
          "/index.ts": `console.log('Hello World')`,
          "/kek.ts": `console.log('Helllo kek')`,
        }}
        // https://sandpack.codesandbox.io/docs/getting-started/usage#fully-custom-setup
        customSetup={{
          entry: "/index.ts",
          // environment: "parcel",
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
      </SandpackProvider> */}
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
      <div className={styles.ResizeHandleInner}>
        {/* <svg className={styles.Icon} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg> */}
      </div>
    </PanelResizeHandle>
  );
}
export default Home;
