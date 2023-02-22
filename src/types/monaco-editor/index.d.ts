import type * as monaco from "monaco-editor";

declare module "monaco-editor" {
  export type Monaco = typeof monaco;
  export type MonacoTheme = monaco.editor.IStandaloneThemeData;
  export type MonacoEditor = monaco.editor.IStandaloneCodeEditor;
  export type MonacoEditorOptions =
    monaco.editor.IStandaloneEditorConstructionOptions;
}
