# توثيق ملفات ومجلدات المشروع

## /home/user/screenplayeditor/App.tsx

*   **المسار:** `/home/user/screenplayeditor/App.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** هذا هو المكون الجذري لتطبيق React. يقوم بإعداد وتغليف التطبيق بمزودات السياق (Context Providers) الأساسية مثل `QueryClientProvider` لإدارة حالة الخادم، و `TooltipProvider` لعرض التلميحات، و `Toaster` لعرض الإشعارات. كما أنه يحتوي على مكون `Router` لإدارة التنقل بين الصفحات.
*   **نقاط التكامل:** يُستدعى هذا المكون من `main.tsx` ليكون نقطة الدخول للتطبيق. يستورد `QueryClientProvider` من `@tanstack/react-query`، و `Switch`/`Route` من `wouter` للتوجيه، بالإضافة إلى مكونات واجهة مستخدم محلية مثل `Toaster` و `TooltipProvider`.
*   **المخاطر/الملاحظات:** الهيكل الحالي بسيط ومناسب لتطبيق صغير. مع نمو التطبيق، قد يحتاج إلى تنظيم أفضل لمزودات السياق، ربما في مكون مخصص `AppProviders`.
*   **قرائن سريعة:** `QueryClientProvider`, `TooltipProvider`, `Router`

## /home/user/screenplayeditor/formatStyles.ts

*   **المسار:** `/home/user/screenplayeditor/formatStyles.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** توفر هذه الوحدة دالة مساعدة (`getFormatStyles`) تقوم بإرجاع سلسلة HTML تحتوي على وسم `div` مع اسم كلاس CSS مطابق لنوع عنصر السيناريو المُمرّر. تُستخدم هذه الدالة لتطبيق التنسيق الأولي على عناصر السيناريو المختلفة.
*   **نقاط التكامل:** تُستدعى هذه الدالة من `ScreenplayCoordinator.ts` و `ScreenplayEditor.tsx` (في الإصدار القديم) و `ScreenplayProcessor.tsx`. إنها تعتمد على وجود كلاسات CSS معرفة مسبقًا في `screenplay.css` لتطبيق الأنماط المرئية.
*   **المخاطر/الملاحظات:** الدالة حاليًا تعيد نفس بنية HTML (`<div class="...">`) لكل الحالات تقريبًا، مما يجعلها محدودة الفائدة. يمكن تبسيطها بشكل كبير أو حتى إزالتها إذا كان المنطق ينتقل بالكامل إلى تطبيق الكلاسات مباشرة.
*   **قرائن سريعة:** `function getFormatStyles(elementType: string)`

## /home/user/screenplayeditor/index.css

*   **المسار:** `/home/user/screenplayeditor/index.css`
*   **النوع:** ملف (`css`)
*   **الوظيفة/الدور:** هذا هو ملف CSS الرئيسي للتطبيق. يقوم باستيراد أنماط السيناريو المخصصة من `screenplay.css`، ويقوم بإعداد Tailwind CSS بتوجيهاته الأساسية (`@tailwind base`, `@tailwind components`, `@tailwind utilities`). كما يعرّف متغيرات CSS الجذرية للسمات الفاتحة (`:root`) والداكنة (`.dark`)، ويطبق أنماطًا أساسية على مستوى `body`.
*   **نقاط التكامل:** يتم استيراد هذا الملف مباشرة في `main.tsx`، مما يجعله متاحًا عالميًا للتطبيق بأكمله. يعتمد على `screenplay.css` و Tailwind CSS.
*   **المخاطر/الملاحظات:** تعريف متغيرات الظل (`--shadow-*`) في السمة الفاتحة والداكنة يبدو غير مكتمل أو غير صحيح، حيث أن قيم `hsl` تحتوي على `0.00` كقيمة ألفا، مما يجعل الظلال غير مرئية.
*   **قرائن سريعة:** `@import url('./styles/screenplay.css');`, `:root { ... }`, `.dark { ... }`

## /home/user/screenplayeditor/main.tsx

*   **المسار:** `/home/user/screenplayeditor/main.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** يمثل هذا الملف نقطة الدخول (entry point) لتطبيق React. يقوم بإنشاء الجذر (root) للتطبيق داخل عنصر DOM الذي يحمل `id="root"`، ثم يقوم بتصيير (render) المكون الرئيسي `App`.
*   **نقاط التكامل:** يستورد `createRoot` من `react-dom/client`، والمكون `App` من `App.tsx`، وملف الأنماط الرئيسي `index.css`. هذا الملف هو بداية شجرة المكونات.
*   **المخاطر/الملاحظات:** لا توجد مخاطر واضحة. هذا الملف يتبع النمط القياسي لتطبيقات React الحديثة.
*   **قرائن سريعة:** `createRoot(document.getElementById("root")!).render(<App />);`

## /home/user/screenplayeditor/not-found.tsx

*   **المسار:** `/home/user/screenplayeditor/not-found.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** يعرض هذا المكون صفحة "404 Page Not Found" عندما يحاول المستخدم الوصول إلى مسار غير موجود في التطبيق. يعرض رسالة خطأ واضحة داخل بطاقة منسقة.
*   **نقاط التكامل:** يُستخدم هذا المكون كمسار افتراضي (fallback route) في `Router` داخل `App.tsx`. يستورد مكونات واجهة المستخدم مثل `Card` و `CardContent` من `@/components/ui/card`.
*   **المخاطر/الملاحظات:** الرسالة "Did you forget to add the page to the router?" موجهة للمطورين أكثر من المستخدمين النهائيين. قد يكون من الأفضل عرض رسالة أكثر عمومية للمستخدم.
*   **قرائن سريعة:** `<h1>404 Page Not Found</h1>`, `<Route component={NotFound} />`

## /home/user/screenplayeditor/queryClient.ts

*   **المسار:** `/home/user/screenplayeditor/queryClient.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** يقوم هذا الملف بإعداد وتهيئة عميل `react-query` (`QueryClient`). يوفر دوال مساعدة لإجراء طلبات API (`apiRequest`) ودالة استعلام افتراضية (`getQueryFn`) تتعامل مع حالات المصادقة (401). يتم تعيين خيارات افتراضية للاستعلامات والتعديلات لضمان سلوك متسق عبر التطبيق.
*   **نقاط التكامل:** يتم استيراد `queryClient` في `App.tsx` لتوفيره للتطبيق بأكمله. تُستخدم `apiRequest` لإجراء طلبات الشبكة، بينما تُستخدم `getQueryFn` كدالة افتراضية لـ `useQuery`.
*   **المخاطر/الملاحظات:** تعيين `staleTime: Infinity` بشكل افتراضي يعني أن البيانات لن تُعتبر قديمة أبدًا ولن يتم إعادة جلبها تلقائيًا، مما قد يؤدي إلى عرض بيانات قديمة ما لم يتم إبطالها يدويًا.
*   **قرائن سريعة:** `new QueryClient({...})`, `defaultOptions`, `staleTime: Infinity`

## /home/user/screenplayeditor/screenplay-processor.tsx

*   **المسار:** `/home/user/screenplayeditor/screenplay-processor.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** هذا المكون هو مجرد غلاف (wrapper) بسيط. وظيفته الوحيدة هي عرض مكون `ScreenplayEditor`. يعمل كصفحة مخصصة لمعالج السيناريو.
*   **نقاط التكامل:** يُستخدم هذا المكون كمسار رئيسي (`path="/"`) في `Router` داخل `App.tsx`. يستورد ويعرض `ScreenplayEditor`.
*   **المخاطر/الملاحظات:** هذا الملف بسيط جدًا لدرجة أنه قد يكون غير ضروري. يمكن استخدام `ScreenplayEditor` مباشرة في `Route` داخل `App.tsx` لتقليل عدد الملفات.
*   **قرائن سريعة:** `import ScreenplayEditor from "@/components/ScreenplayEditor";`, `return <ScreenplayEditor />;`

## /home/user/screenplayeditor/screenplay.css

*   **المسار:** `/home/user/screenplayeditor/screenplay.css`
*   **النوع:** ملف (`css`)
*   **الوظيفة/الدور:** يحتوي هذا الملف على جميع أنماط CSS المتخصصة لتنسيق صفحة السيناريو ومكوناتها المختلفة (ترويسة المشهد، الحوار، الشخصية، إلخ). يحدد أبعاد الصفحة (A4)، الهوامش، والأنماط لكل نوع من عناصر السيناريو.
*   **نقاط التكامل:** يتم استيراده في `index.css` ليتم تطبيقه عالميًا. الكلاسات المعرفة هنا (مثل `.scene-header-1`, `.action`) يتم تطبيقها ديناميكيًا بواسطة `ScreenplayCoordinator` و `ScreenplayEditor`.
*   **المخاطر/الملاحظات:** بعض الأنماط (مثل الهوامش) مكررة بين هذا الملف والأنماط المضمنة (inline styles) في `ScreenplayProcessor.tsx` و `ScreenplayPasteProcessor.ts`. يجب توحيد مصدر الأنماط.
*   **قرائن سريعة:** `.script-page`, `.scene-header-1`, `.character`, `.dialogue`

## /home/user/screenplayeditor/ScreenplayCoordinator.ts

*   **المسار:** `/home/user/screenplayeditor/ScreenplayCoordinator.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** هذا الكلاس هو العقل المدبر وراء تحليل نص السيناريو. يحتوي على منطق لتصنيف كل سطر من النص (`classifyLine`) إلى نوع عنصر محدد (مشهد، شخصية، حوار، إلخ) بناءً على قواعد محددة مسبقًا. ثم يقوم بإنشاء HTML بسيط لكل سطر مع الكلاس المناسب.
*   **نقاط التكامل:** يتم استخدامه في `ScreenplayEditor.tsx` (في `handlePaste`) وفي `ScreenplayPasteProcessor.ts` و `ScreenplayProcessor.tsx` لمعالجة النص. يعتمد على دالة `getFormatStyles` (بشكل غير مباشر) لتطبيق الأنماط.
*   **المخاطر/الملاحظات:** منطق التصنيف (`classifyLine`) يعتمد على قواعد صارمة (مثل الأحرف الكبيرة والبدايات المحددة) وقد يفشل مع النصوص التي لا تلتزم بالتنسيق القياسي تمامًا. دالة `escapeHtml` تستخدم DOM API (`document.createElement`) مما يجعل هذا الكلاس غير قابل للاستخدام في بيئة الخادم (Server-Side Rendering) بدون تعديل.
*   **قرائن سريعة:** `classifyLine(line: string)`, `processLine(line: string, ...)`

## /home/user/screenplayeditor/ScreenplayEditor.tsx

*   **المسار:** `/home/user/screenplayeditor/ScreenplayEditor.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** هذا هو المكون الرئيسي لواجهة المستخدم لتحرير السيناريو. يوفر محرر نصي (`contentEditable div`) حيث يمكن للمستخدمين لصق وكتابة نص السيناريو. يحتوي على منطق لمعالجة اللصق (`handlePaste`)، وتحديث الإحصائيات (عدد الكلمات والصفحات)، وتغيير السمات (فاتح/داكن) والخطوط.
*   **نقاط التكامل:** يستورد ويستخدم `ScreenplayCoordinator` لمعالجة النص الملصوق. يستخدم `getFormatStyles` لتطبيق الأنماط ديناميكيًا. يتم عرضه بواسطة `ScreenplayProcessorPage`.
*   **المخاطر/الملاحظات:** هناك تكرار كبير للمنطق. منطق معالجة اللصق وتطبيق الأنماط موجود هنا وأيضًا في `ScreenplayPasteProcessor.ts` و `ScreenplayProcessor.tsx`. استخدام `dangerouslySetInnerHTML` للأنماط المضمنة يجعل الصيانة صعبة.
*   **قرائن سريعة:** `contentEditable={true}`, `handlePaste`, `useMemo(() => new ScreenplayCoordinator(...))`

## /home/user/screenplayeditor/ScreenplayPasteProcessor.ts

*   **المسار:** `/home/user/screenplayeditor/ScreenplayPasteProcessor.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** هذا الكلاس مصمم لمعالجة عملية لصق نص السيناريو في المحرر. يقوم بقراءة النص من الحافظة، وتقسيمه إلى أسطر، واستخدام `ScreenplayCoordinator` لتصنيف كل سطر، ثم بناء صفحات HTML ديناميكيًا مع مراعاة فواصل الصفحات بناءً على ارتفاع المحتوى.
*   **نقاط التكامل:** يستورد `ScreenplayCoordinator` و `getFormatStyles`. يبدو أنه مصمم للعمل مباشرة مع DOM API. لا يتم استيراده أو استخدامه في أي مكان آخر في الكود المقدم، مما يجعله يتيمًا.
*   **المخاطر/الملاحظات:** هذا الملف غير مستخدم حاليًا في المشروع. يحتوي على منطق مكرر بشكل كبير مع `ScreenplayProcessor.tsx` و `ScreenplayEditor.tsx` (خاصة `handlePaste`). تطبيق الأنماط يتم عبر `Object.assign(block.style, ...)` مما يخلط بين الهيكل والأنماط.
*   **قرائن سريعة:** `processPaste(e: ClipboardEvent)`, `createPage(): HTMLDivElement`, `applyFormattingRules(...)`

## /home/user/screenplayeditor/ScreenplayProcessor.tsx

*   **المسار:** `/home/user/screenplayeditor/ScreenplayProcessor.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** هذا المكون يعرض صفحة A4 فارغة ويحتوي على منطق لمعالجة نص السيناريو عند لصقه أو النقر عليه. يستخدم `ScreenplayCoordinator` لتحليل النص وإنشاء عناصر DOM ديناميكيًا، مع تقسيم المحتوى على صفحات متعددة.
*   **نقاط التكامل:** يستورد `ScreenplayCoordinator` و `getFormatStyles`. لا يتم استيراده أو استخدامه في أي مكان آخر في الكود المقدم، مما يجعله يتيمًا.
*   **المخاطر/الملاحظات:** هذا الملف غير مستخدم حاليًا. يحتوي على منطق مكرر بشكل كبير مع `ScreenplayPasteProcessor.ts` و `ScreenplayEditor.tsx`. التلاعب المباشر بالـ DOM (`document.body.appendChild`) خارج دورة حياة React يعتبر ممارسة سيئة ويجب تجنبها.
*   **قرائن سريعة:** `processContent(rawText: string)`, `handlePaste(e: ClipboardEvent)`, `createPage(): HTMLDivElement`

## /home/user/screenplayeditor/types.ts

*   **المسار:** `/home/user/screenplayeditor/types.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** يوفر هذا الملف تعريفات TypeScript المشتركة المستخدمة في أجزاء مختلفة من منطق معالجة السيناريو. يعرّف `AgentContext` (كائن سياق مرن) و `ProcessLineResult` (الناتج من معالجة سطر واحد).
*   **نقاط التكامل:** يتم استيراد الأنواع المعرفة هنا في `ScreenplayCoordinator.ts` و `ScreenplayProcessor.tsx` و `ScreenplayPasteProcessor.ts`.
*   **المخاطر/الملاحظات:** `AgentContext` معرّف كـ `{[key: string]: any;}` وهو نوع ضعيف جدًا. من الأفضل تحديد الحقول المتوقعة في السياق لتحسين سلامة الأنواع.
*   **قرائن سريعة:** `interface AgentContext`, `interface ProcessLineResult`

## /home/user/screenplayeditor/use-mobile.tsx

*   **المسار:** `/home/user/screenplayeditor/use-mobile.tsx`
*   **النوع:** ملف (`tsx`)
*   **الوظيفة/الدور:** هذا الخطاف (Hook) المخصص `useIsMobile` يكتشف ما إذا كان المستخدم يتصفح من جهاز محمول بناءً على عرض الشاشة. يستخدم `window.matchMedia` للاستماع إلى تغييرات حجم الشاشة وتحديث الحالة بكفاءة.
*   **نقاط التكامل:** يتم استيراده واستخدامه في `components/ui/sidebar.tsx` لتغيير سلوك الشريط الجانبي بين أجهزة سطح المكتب والأجهزة المحمولة.
*   **المخاطر/الملاحظات:** هذا الملف موجود في الجذر بينما يبدو أنه خطاف مخصص لواجهة المستخدم. من الأفضل نقله إلى مجلد `hooks` أو `lib`.
*   **قرائن سريعة:** `const MOBILE_BREAKPOINT = 768`, `window.matchMedia(...)`

## /home/user/screenplayeditor/use-toast.ts

*   **المسار:** `/home/user/screenplayeditor/use-toast.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** هذا الملف ينفذ نظام إشعارات (toast) مخصص. يوفر الخطاف `useToast` ودالة `toast` لإنشاء وإدارة الإشعارات. يستخدم `reducer` لإدارة الحالة بشكل مركزي ويسمح بتحديث وإغلاق الإشعارات.
*   **نقاط التكامل:** يتم استخدامه بواسطة مكون `Toaster` في `App.tsx` لعرض الإشعارات.
*   **المخاطر/الملاحظات:** قيمة `TOAST_REMOVE_DELAY` كبيرة جدًا (`1000000`)، مما يعني أن الإشعارات لن تختفي تلقائيًا. هذا قد يكون مقصودًا إذا كان الإغلاق دائمًا يدويًا.
*   **قرائن سريعة:** `function useToast()`, `function toast(...)`, `const TOAST_REMOVE_DELAY = 1000000`

## /home/user/screenplayeditor/utils.ts

*   **المسار:** `/home/user/screenplayeditor/utils.ts`
*   **النوع:** ملف (`ts`)
*   **الوظيفة/الدور:** يوفر دالة مساعدة (`cn`) لدمج أسماء كلاسات CSS بشكل شرطي. يستخدم مكتبتي `clsx` و `tailwind-merge` لإنشاء سلسلة كلاسات نهائية نظيفة وخالية من التعارضات، وهو نمط شائع في المشاريع التي تستخدم Tailwind CSS.
*   **نقاط التكامل:** يتم استيراد هذه الدالة في مكونات واجهة المستخدم مثل `components/ui/chart.tsx` و `components/ui/sidebar.tsx` لتطبيق الكلاسات ديناميكيًا.
*   **المخاطر/الملاحظات:** لا توجد مخاطر واضحة. هذا الملف هو أداة مساعدة قياسية ومفيدة.
*   **قرائن سريعة:** `import { clsx, type ClassValue } from "clsx"`, `import { twMerge } from "tailwind-merge"`

---

### قائمة تحقق التغطية (Coverage Checklist)

*   `/home/user/screenplayeditor/App.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/formatStyles.ts`: ✅ موثّق
*   `/home/user/screenplayeditor/index.css`: ✅ موثّق
*   `/home/user/screenplayeditor/main.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/not-found.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/queryClient.ts`: ✅ موثّق
*   `/home/user/screenplayeditor/screenplay-processor.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/screenplay.css`: ✅ موثّق
*   `/home/user/screenplayeditor/ScreenplayCoordinator.ts`: ✅ موثّق
*   `/home/user/screenplayeditor/ScreenplayEditor.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/ScreenplayPasteProcessor.ts`: ✅ موثّق
*   `/home/user/screenplayeditor/ScreenplayProcessor.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/types.ts`: ✅ موثّق
*   `/home/user/screenplayeditor/use-mobile.tsx`: ✅ موثّق
*   `/home/user/screenplayeditor/use-toast.ts`: ✅ موثّق
*   `/home/user/screenplayeditor/utils.ts`: ✅ موثّق
