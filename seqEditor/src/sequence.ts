import { some, keys, forEach, toUpper, trim } from "lodash";
// import { UPLOAD_SUPPORT_FORMAT } from "@/constants";
// import { IBioParseResult } from "../types/alignment";

export enum E_SEQ_TYPE {
  Nucleotide = 1,
  Protein = 2,
}

export interface IBioParseResult {
  label: string;
  sequence: string;
  type: string;
}

export interface ISequenceSegment {
  start: number;
  segment: string[];
  end: number;
}

const seqExtractRegexp = />[^>]*/g;
const seqValidReg = /^[a-zA-Z]+$/;
const invalidWordReg = /[^a-zA-Z]/g;
const whitespaceCommaRegexp = /\s|\\,/g;
export const nucleotideReg = /^[ATCGUCRYN]+$/;

export const splitIntoSegments = (
  sequence: string,
  length: number
): ISequenceSegment[] => {
  const segments = [];
  let preEnd = 0;
  let startIndex = 0;
  let endIndex = 0;
  for (let i = 0, size = sequence.length; i < size; ) {
    const end = i + length;
    const segment = sequence.slice(i, end);
    // 计算有效序列字符的数量
    const validLength = segment.replace(invalidWordReg, "").length;
    if (validLength > 0) {
      startIndex = preEnd + 1;
      endIndex = startIndex + validLength - 1;
    } else {
      startIndex = preEnd;
      endIndex = preEnd;
    }
    segments.push({
      start: startIndex, // 有效序列的起始位置
      segment: segment.split(""),
      end: endIndex, // 有效序列的结束位置
    });
    preEnd = endIndex;
    i = end;
  }
  return segments;
};

/**
 * 计算覆盖率
 * @param {string} seq Sequence string
 * @param {Array} allowBases 有效字符
 */
const countDna = (
  seq: string,
  allowBases = ["A", "T", "G", "U", "C", "R", "Y", "N"]
) => {
  const totalDnaBases = seq
    .split("")
    .reduce(
      (count, sq) =>
        count + (allowBases.indexOf(sq.toUpperCase()) === -1 ? 0 : 1),
      0
    );
  const dnaFraction = totalDnaBases / seq.length;
  return dnaFraction * 100;
};

/**
 * 判断 Sequence 为核酸还是蛋白质
 * @param {string} seq Sequence string
 * @param {Number} minimum 有效字符大于90%为核酸, 小于90%为蛋白质
 */
export const isDna = (seq: string, minimum = 90) => countDna(seq) > minimum;

export const readFASTAFile = (file: Blob) =>
  new Promise((resolve, reject) => {
    if (!window.FileReader) {
      reject();
    }
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result);
    };
  });

// 是否是fasta文件
// export const isFastaFile = (fileName: string) => {
//   const fastaSuffixs = UPLOAD_SUPPORT_FORMAT;
//   return some(fastaSuffixs, (v: any) => fileName.lastIndexOf(v) !== -1);
// };

/**
 * 根据序列传递的种类来判断序列的后缀是核酸nt还是蛋白aa,并拼接序列本身的长度
 * @param sequence
 * @param type
 */
export const getSequenceUnitByType = (type: E_SEQ_TYPE) => {
  if (!type) {
    return "";
  }
  if (type === E_SEQ_TYPE.Protein) {
    return `aa`;
  }
  return `bp`;
};

// 三转一对应表
export const CONVERT_LETTERS_MAP = {
  Ala: "A",
  Asx: "B",
  Cys: "C",
  Asp: "D",
  Glu: "E",
  Phe: "F",
  Gly: "G",
  His: "H",
  Ile: "I",
  Lys: "K",
  Leu: "L",
  Met: "M",
  Asn: "N",
  Pro: "P",
  Gln: "Q",
  Arg: "R",
  Ser: "S",
  Thr: "T",
  Val: "V",
  Trp: "W",
  Xaa: "X",
  Tyr: "Y",
  Glx: "Z",
  Xle: "J",
  Pyl: "O",
  Sec: "U",
};

export const CONVERT_LETTERS_REVERSE: Map<string, string> = new Map();
Object.keys(CONVERT_LETTERS_MAP).map((x) => {
  // @ts-ignore
  CONVERT_LETTERS_REVERSE.set(CONVERT_LETTERS_MAP[x], x);
});

export const CONVERT_LETTERS = keys(CONVERT_LETTERS_MAP) as Array<
  keyof typeof CONVERT_LETTERS_MAP
>;

// 三转一规则
export const threeRuleReg = new RegExp(`${CONVERT_LETTERS.join("|")}`, "g");

export const removeWhitespaceAndComma = (value: string) =>
  (value || "").replace(whitespaceCommaRegexp, "");

/**
 * 三合一转化
 * @param sequence
 * @returns {*}
 */
export const threeToOneConversion = (sequence: string) => {
  forEach(CONVERT_LETTERS, (item) => {
    sequence = sequence.replace(
      new RegExp(`${item}`, "g"),
      CONVERT_LETTERS_MAP[item]
    );
  });
  return sequence.replaceAll(",", "");
};

export const isThreeToOneSequence = (value: string) => {
  if (!value) return false;
  // @ts-ignore
  const match = value.match(threeRuleReg);
  return match && match.length > 0;
};

export function checkInput(val: string, isThree: boolean) {
  if (isThree) {
    return isThreeToOneSequence(val);
  }
  const reg = /^[a-zA-Z]+$/;
  return reg.test(val);
}

export const removeWhitespace = (value: string) =>
  (value || "").replace(whitespaceCommaRegexp, "");

export const checkSequenceType = (sequence: string) => {
  if (!sequence || !sequence.length) {
    return "";
  }
  return isDna(sequence) ? "nucleotide" : "protein";
};

/**
 * 解析序列
 *
 * @param {string} input
 * @returns {sequence[]}
 */
export const parse = (input: string, type?: string): IBioParseResult[] => {
  const sequences = [];
  if (input.indexOf(">") < 0) {
    let sequence;
    if (isThreeToOneSequence(input)) {
      sequence = threeToOneConversion(input);
    } else {
      sequence = removeWhitespace(toUpper(input));
    }
    if (type === "origin") {
      sequence = input;
    }
    if (sequence) {
      sequences.push({
        label: "",
        sequence,
      });
    }
  } else {
    let match;

    // eslint-disable-next-line
    while ((match = seqExtractRegexp.exec(input)) !== null) {
      const string = match[0];
      const index = string.indexOf("\n");
      let label = "";
      let seq = "";

      if (index > -1) {
        label = string.slice(1, index);
        seq = string.slice(index + 1);
      } else {
        label = string.slice(1);
      }
      let sequence = "";
      if (isThreeToOneSequence(seq)) {
        sequence = threeToOneConversion(seq);
      } else {
        sequence = removeWhitespace(toUpper(seq));
      }
      if (type === "origin") {
        sequence = seq;
      }
      sequences.push({
        label: trim(label),
        sequence,
      });
    }
  }
  return sequences.map((v) => ({
    ...v,
    type: checkSequenceType(trim(v.sequence)),
    // valid: isValidSequence(v.sequence)
  }));
};

export function mapMatch(t: string) {
  return t === "A"
    ? "T"
    : t === "T"
    ? "A"
    : t === "C"
    ? "G"
    : t === "G"
    ? "C"
    : t === "U"
    ? "A"
    : t;
}

/**
 * 计算序列的配置序列
 * */
export function calculateMatchedParsedSeqs(parsedSeq: ISequenceSegment[]) {
  return parsedSeq.map((x) => {
    return {
      start: x.start,
      end: x.end,
      segment: x.segment.map((x: string) => {
        return mapMatch(x);
      }),
    };
  });
}
