import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import * as monaco from "monaco-editor";
import "./style.css";
import { parse, splitIntoSegments } from "./sequence";

self.MonacoEnvironment = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getWorker(_: string, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (["typescript", "javascript", "plaintext"].includes(label)) {
      return new tsWorker();
    }
    return new EditorWorker();
  },
};

// 1. 注册自定义格式化提供器
monaco.languages.registerDocumentFormattingEditProvider("plaintext", {
  provideDocumentFormattingEdits(model, options, token) {
    // 2. 获取当前代码
    const text = model.getValue();

    // 3. 应用自定义格式化规则 (示例规则)
    const formattedText = applyCustomFormatting(text);

    // 4. 返回 TextEdit 操作
    return [
      {
        range: model.getFullModelRange(), // 全文范围
        text: formattedText,
      },
    ];
  },
});

// 自定义格式化函数（示例：缩进2空格 + 分号强制添加）
function applyCustomFormatting(code: string) {
  let formatted = "";

  let res = parse(code);

  res.forEach(({ label, sequence }) => {
    formatted += `>${label}\n`;
    const segments = splitIntoSegments(sequence, 80);
    segments.forEach((segment) => {
      formatted += `${segment.segment.join("")}\n`;
    });
  });

  return formatted;
}

// 初始化编辑器
let app = document.getElementById("app");
if (app) {
  const editor = monaco.editor.create(app, {
    value: `>Sequence Code 9924150
QVQLVQSGAEVKKPGASVKVSCKASGYTFTSYGISWVRQAPGQGLEWMGWISAYNGNTNYAQKLQGRVTMTTDTSTSTAYMELRSLRSDDTAVYYCARYMDVWGQGTLVTVSS



>Sequence Code 9924133
QVQLVQSGAEVKKPGASVKVSCKASGYTFTSYGISWVRQAPGQGLEWMGWISAYNGNTNYAQKLQGRVTMTTDTSTSTAYMELRSLRSDDTAVYYCARYMDVWGKGTTVTVSS`,
    language: "plaintext",
  });

  const dom = document.getElementById("btn_format");

  dom?.addEventListener("click", () => {
    if (editor) {
      editor.getAction("editor.action.formatDocument")?.run();
    }
  });
}
