/* eslint-disable no-control-regex */
/**
 * Screenplay line classifier for Arabic scripts (TypeScript)
 * يدعم:
 * - basmala
 * - scene-header-1 / scene-header-2 / scene-header-3 (بما في ذلك الوقت أولاً أو الداخل/الخارج أولاً)
 * - character / dialogue / parenthetical (قصير فقط)
 * - transition
 * - action (بالاستبعاد)
 *
 * القواعد المضافة:
 * - Normalization: توحيد الشرطات والفواصل إلى "-"، إزالة التشكيل، توحيد الأرقام (اختياري).
 * - scene-header-2 يدعم ترتيب (INOUT-TIME) و(TIME-INOUT) مع تسوية الشرطة.
 * - scene-header-3 يجمع المكان من نفس السطر، ثم من أسطر لاحقة حتى عنصر جديد.
 * - الترجمة بين قوسين (جملة كاملة/طويلة/تفسيرية) تُعدّ "dialogue" وتُنسب للمتحدث النشط
 *   أو آخر متحدث سابق إن لم يوجد متحدث نشط.
 * - parenthetical يُحصر في الوصف الأدائي القصير (≤ 6 كلمات) بلا علامات جُمَل (؟ . !).
 */

export type ElementType =
  | 'basmala'
  | 'scene-header-1'
  | 'scene-header-2'
  | 'scene-header-3'
  | 'character'
  | 'parenthetical'
  | 'dialogue'
  | 'transition'
  | 'action';

export interface DialogueEntry {
  character: string;
  text: string;
}

export interface ExtractResult {
  basmala?: string;
  'scene-header-1': string[];
  'scene-header-2': string[];
  'scene-header-3': string[];
  action: string[];
  character: string[];
  parenthetical: string[];
  dialogue: DialogueEntry[];
  transition: string[];
}

export const AR_AB_LETTER = '\u0600-\u06FF';
const EASTERN_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const WESTERN_DIGITS = '0123456789';

function easternToWesternDigits(s: string): string {
  let out = '';
  for (const ch of s) {
    const idx = EASTERN_DIGITS.indexOf(ch);
    out += idx >= 0 ? WESTERN_DIGITS[idx] : ch;
  }
  return out;
}

function stripTashkeel(s: string): string {
  // إزالة التشكيل والعلامات الحركية الشائعة
  return s.replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g, '');
}

/** توحيد الشرطات/الفواصل إلى "-" وتقليل الفراغات */
function normalizeSeparators(s: string): string {
  return s
    .replace(/[–—]/g, '-')   // en/em dash → hyphen
    .replace(/[,:،]/g, '-')  // فواصل/نقطتين → شرطة
    .replace(/\s*-\s*/g, '-') // إحاطة موحدة للشرطة
    .replace(/\s+/g, ' ')
    .trim();
}

/** التطبيع المبدئي (Normalization) كما في الشروط */
function normalizeLine(input: string): string {
  let s = input;
  s = easternToWesternDigits(s);
  s = stripTashkeel(s);
  s = s.replace(/\u200f|\u200e|\ufeff/g, ''); // علامات اتجاه/BOM إن وجدت
  s = s.replace(/\t/g, ' ');
  s = s.replace(/\s+$/g, '');
  return s;
}

/** أدوات مساعدة للحكم على "ترجمة" داخل أقواس */
function textInsideParens(s: string): string {
  const m = s.match(/^\s*\((.*)\)\s*$/);
  return m ? m[1].trim() : s.trim();
}
function hasSentencePunctuation(s: string): boolean {
  return /[\.!\؟\?]/.test(s);
}
function wordCount(s: string): number {
  // تقسيم بسيط على الفراغ (بعد تطبيع أساسي)
  return s.trim().split(/\s+/).filter(Boolean).length;
}
function containsNonArabicLetters(s: string): boolean {
  // اعتبر وجود لاتينية/سريانية مؤشراً على ترجمة/نقل صوتي
  return /[A-Za-z\u0700-\u074F]/.test(s);
}
function isLikelyTranslationParenContent(s: string): boolean {
  // ترجمة إذا: جملة كاملة/علامات ترقيم، أو > 6 كلمات، أو نص غير عربي واضح
  return hasSentencePunctuation(s) || wordCount(s) > 6 || containsNonArabicLetters(s);
}

const BASMALA_RE = /^\s*بسم\s+الله\s+الرحمن\s+الرحيم\s*$/;

const SCENE_PREFIX_RE = new RegExp(
  // يقبل: مشهد|م. + أرقام غربية (بعد التطبيع) ثم أي بقايا
  String.raw`^\s*(?:مشهد|م\.)\s*([0-9]+)\s*(?:[-–—:،]\s*)?(.*)$`,
  'i'
);

// IN/OUT و TIME كما في المواصفات، مع قبول الاختصارات
const INOUT_PART = String.raw`(?:داخلي|خارجي|د\.|خ\.)`;
const TIME_PART = String.raw`(?:ليل|نهار|ل\.|ن\.|صباح|مساء|فجر|ظهر|عصر|مغرب|الغروب|الفجر)`;

// يدعم: (INOUT[-]?TIME | TIME[-]?INOUT)
const TL_REGEX = new RegExp(
  String.raw`(?:${INOUT_PART}\s*-?\s*${TIME_PART}|${TIME_PART}\s*-?\s*${INOUT_PART})`,
  'i'
);

// اسم شخصية عربي محتمل (يسمح بـ"صوت ")
const CHARACTER_RE = new RegExp(
  String.raw`^\s*(?:صوت\s+)?[${AR_AB_LETTER}][${AR_AB_LETTER}\s]{0,40}\s*:?\s*$`
);

// انتقالات عربية/إنجليزية شائعة
const TRANSITION_RE = /^\s*(?:قطع|قطع\s+إلى|إلى|مزج|ذوبان|خارج\s+المشهد|CUT TO:|FADE IN:|FADE OUT:)\s*$/i;

// سطر بين قوسين (إرشاد/ترجمة) — الحكم التفصيلي لاحقاً
const PARENTHETICAL_SHAPE_RE = /^\s*\(.*?\)\s*$/;

// heuristics لمؤشرات أفعال حركة عربية شائعة (للمساعدة فقط)
const ACTION_VERBS = /^(?:يدخل|يخرج|ينظر|يرفع|تبتسم|ترقد|تقف|يبتسم|يضع|يقول|تنظر|تربت|تقوم|يشق|تشق|تضرب|يسحب|يلتفت)\b/;

/** هل السطر فارغ (بعد التطبيع)؟ */
function isBlank(line: string): boolean {
  return !line || !line.trim();
}

/** basmala */
export function isBasmala(line: string): boolean {
  const s = normalizeLine(line);
  return BASMALA_RE.test(s);
}

/** Scene Header start */
export function isSceneHeaderStart(line: string): boolean {
  const s = normalizeLine(line);
  return SCENE_PREFIX_RE.test(s);
}

/** التقط timeLocation/place من نفس السطر بعد "مشهد N" */
export function parseSceneHeaderFromLine(
  rawLine: string
): { sceneNum: string; timeLocation: string; placeInline: string } | null {
  const line = normalizeSeparators(normalizeLine(rawLine));
  const m = line.match(SCENE_PREFIX_RE);
  if (!m) return null;

  const sceneNumDigits = m[1]; // غربية بالفعل بعد normalizeLine
  const rest = m[2] ?? '';

  let timeLocation = '';
  let placeInline = '';

  const tl = rest.match(TL_REGEX);
  if (tl) {
    // تسوية الشرطة إلى "-"
    timeLocation = tl[0].replace(/\s*[-–—:،]\s*/g, '-').trim();
    const after = rest.slice((tl.index ?? 0) + tl[0].length);
    placeInline = normalizeSeparators(after).replace(/^\s*-\s*/, '').trim();
  } else {
    // لم يُلتقط وقت/مكان → اعتبر الباقي مكانًا تفصيليًا
    placeInline = rest.trim();
  }

  const sceneNum = `مشهد ${sceneNumDigits}`;
  return { sceneNum, timeLocation, placeInline };
}

/** Transition */
export function isTransition(line: string): boolean {
  const s = normalizeLine(line);
  return TRANSITION_RE.test(s);
}

/** Character line (يسمح بدون نقطتين) */
export function isCharacterLine(line: string): boolean {
  const s = normalizeLine(line);
  if (isSceneHeaderStart(s)) return false;
  if (isTransition(s)) return false;
  return CHARACTER_RE.test(s);
}

/** شكل سطر داخل أقواس */
export function isParenShaped(line: string): boolean {
  const s = normalizeLine(line);
  return PARENTHETICAL_SHAPE_RE.test(s);
}

/** هل هذا السطر بين قوسين يُعد ترجمة حوار (لا إرشادًا قصيرًا)؟ */
export function isParenTranslation(line: string): boolean {
  const s = normalizeLine(line);
  if (!PARENTHETICAL_SHAPE_RE.test(s)) return false;
  const inner = textInsideParens(s);
  return isLikelyTranslationParenContent(inner);
}

/** هل هذا السطر بين قوسين يُعد Parenthetical قصيرًا؟ */
export function isShortParenthetical(line: string): boolean {
  const s = normalizeLine(line);
  if (!PARENTHETICAL_SHAPE_RE.test(s)) return false;
  const inner = textInsideParens(s);
  // شرط القِصر (≤ 6 كلمات) وغياب علامات الجُمَل
  return !isLikelyTranslationParenContent(inner) && wordCount(inner) <= 6 && !hasSentencePunctuation(inner);
}

/** Action (بالاستبعاد + دلائل) */
export function isLikelyAction(line: string): boolean {
  const s = normalizeLine(line);
  if (!s) return false;
  if (isBasmala(s)) return false;
  if (isSceneHeaderStart(s)) return false;
  if (isTransition(s)) return false;
  if (isParenShaped(s)) return false; // يُحسم لاحقًا (ترجمة/إرشاد)
  if (isCharacterLine(s)) return false;
  // دلائل فعلية فقط (لا نُرجِع true افتراضيًا)
  return ACTION_VERBS.test(s);
}

/**
 * اجمع المشهد: scene-header-1/2/3
 * يلتقط المكان من نفس السطر ثم يُكمل من أسطر لاحقة طالما لم يبدأ عنصر جديد.
 */
export function extractSceneHeaderParts(
  lines: string[],
  startIndex: number
): {
  sceneNum: string;
  timeLocation: string;
  place: string;
  consumedLines: number;
} | null {
  const first = lines[startIndex] ?? '';
  const parsed = parseSceneHeaderFromLine(first);
  if (!parsed) return null;

  let { sceneNum, timeLocation, placeInline } = parsed;
  let place = placeInline;
  let consumed = 1;

  // اجمع امتدادات المكان من الأسطر التالية
  let i = startIndex + 1;
  while (i < lines.length) {
    const nextRaw = lines[i] ?? '';
    const next = normalizeLine(nextRaw);

    if (isBlank(next)) {
      consumed++;
      i++;
      continue;
    }

    // توقّف عند أول عنصر جديد واضح
    if (
      isSceneHeaderStart(next) ||
      isTransition(next) ||
      isCharacterLine(next) ||
      isParenShaped(next) || // Parenthetical/ترجمة
      isBasmala(next) ||
      isLikelyAction(next)   // إيقاف عند أول سطر Action محتمل
    ) {
      break;
    }

    // خلاف ذلك اعتبره استمرارًا للمكان التفصيلي
    const normalizedNext = normalizeSeparators(next).replace(/^\s*-\s*/, '').trim();
    if (normalizedNext) {
      // افصل الأجزاء بـ " – " كما في المواصفات
      place = place ? `${place} – ${normalizedNext}` : normalizedNext;
    }
    consumed++;
    i++;
  }

  return { sceneNum, timeLocation, place: place.trim(), consumedLines: consumed };
}

/**
 * صنّف وثيقة كاملة (مصفوفة أسطر) وأخرج الهيكل المطلوب.
 * الحوار يُجمع كسجلّات {character, text}.
 * ترتيب القرار:
 *  basmala → scene-header(1→2→3) → transition → character → parenthetical القصير → dialogue → action
 */
export function classifyDocument(lines: string[]): ExtractResult {
  const out: ExtractResult = {
    'scene-header-1': [],
    'scene-header-2': [],
    'scene-header-3': [],
    action: [],
    character: [],
    parenthetical: [],
    dialogue: [],
    transition: []
  };

  let currentCharacter: string | null = null;
  let lastCharacterSeen: string | null = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx] ?? '';
    const line = normalizeLine(raw);
    if (isBlank(line)) {
      // إنهاء حوار جارٍ عند فراغ، لكن نحتفظ بآخر متحدث
      currentCharacter = null;
      continue;
    }

    // 1) Basmala
    if (isBasmala(line)) {
      out.basmala = raw.trim();
      currentCharacter = null;
      continue;
    }

    // 2) Scene Header (مع تجميع)
    if (isSceneHeaderStart(line)) {
      const parts = extractSceneHeaderParts(lines, idx);
      if (parts) {
        const { sceneNum, timeLocation, place, consumedLines } = parts;
        out['scene-header-1'].push(sceneNum);
        if (timeLocation) out['scene-header-2'].push(timeLocation);
        if (place) out['scene-header-3'].push(place);
        idx += (consumedLines - 1);
        currentCharacter = null;
        continue;
      }
    }

    // 3) Transition
    if (isTransition(line)) {
      out.transition.push(raw.trim());
      currentCharacter = null;
      continue;
    }

    // 4) Character
    if (isCharacterLine(line)) {
      // إزالة النقطتين إن وجِدت
      const name = raw.replace(/:\s*$/, '').trim();
      out.character.push(name);
      currentCharacter = name;
      lastCharacterSeen = name;
      continue;
    }

    // 5) سطر بين قوسين:
    if (isParenShaped(line)) {
      const inner = textInsideParens(line);

      // 5.a ترجمة/تفسير → تُعد "dialogue"
      if (isLikelyTranslationParenContent(inner)) {
        const speaker = currentCharacter || lastCharacterSeen;
        if (speaker) {
          out.dialogue.push({ character: speaker, text: raw.trim() });
          // لا نقطع الحوار إذا كان هناك currentCharacter
          continue;
        }
        // إن لم يوجد متحدث سابق، تعامل معه كـ action احتياطيًا:
        out.action.push(raw.trim());
        continue;
      }

      // 5.b إرشاد قصير أصيل → parenthetical
      if (wordCount(inner) <= 6 && !hasSentencePunctuation(inner)) {
        out.parenthetical.push(raw.trim());
        // لا يُنهي الحوار؛ يستخدمه المتحدث التالي/الحالي
        continue;
      }

      // خلاف ذلك (نادر): عومه كحوار إذا وُجد متحدث، وإلا Action
      if (currentCharacter || lastCharacterSeen) {
        out.dialogue.push({ character: currentCharacter || lastCharacterSeen!, text: raw.trim() });
      } else {
        out.action.push(raw.trim());
      }
      continue;
    }

    // 6) Dialogue: إذا هناك متحدث نشط
    if (currentCharacter) {
      out.dialogue.push({ character: currentCharacter, text: raw.trim() });
      continue;
    }

    // 7) Action (بالاستبعاد)
    if (!isBlank(line)) {
      out.action.push(raw.trim());
      currentCharacter = null;
      continue;
    }
  }

  return out;
}

/* ============================
   مثال استخدام (اختياري)
   ============================
import { classifyDocument } from './screenplayClassifier';

const text = `
بسم الله الرحمن الرحيم

مشهد 1 - ليل-داخلي – قصر المُشتكي – غرفة الكهف
ترقد هند بجوارها شيماء على احد الاسرة فى المستشفى
هند
بطني بتتقطع يا شيماء
( وانتي .. الم تكوني .. ابنة ابيكي ؟ )
قطع
`;

const lines = text.split(/\r?\n/);
const res = classifyDocument(lines);
console.log(res);
*/

    