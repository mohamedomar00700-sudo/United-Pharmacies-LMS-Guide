import {
  UploadCloud,
  BookOpen,
  FileQuestion,
  BarChart3,
  Users,
  AlertTriangle
} from 'lucide-react';
import { TopicData, TopicId } from './types';

export const APP_NAME = "صيدليات المتحدة - بوابة التعليم الإلكتروني";
export const APP_DESC = "الدليل الشامل لاستخدام نظام Moodle LMS";

export const TOPICS: TopicData[] = [
  {
    id: TopicId.UPLOAD,
    title: "رفع المحتوى",
    description: "كيفية رفع الفيديوهات، الملفات، والعروض التقديمية.",
    icon: UploadCloud,
    color: "sky",
    steps: [
      "تسجيل الدخول على LMS.",
      "اختر الكورس المطلوب.",
      "اضغط “Add Resource” أو “Upload File”.",
      "اختر نوع الملف (Video, PDF, PPT).",
      "ضع اسم واضح للملف ووصف قصير.",
      "اضبط خيارات الوصول (Visible/Hidden, Restricted Access).",
      "اضغط Save & Publish."
    ],
    faq: [
      {
        question: "ماذا أفعل إذا لم يُرفع الفيديو؟",
        answer: "تأكد من حجم الملف، نوع الملف، وسرعة الإنترنت."
      },
      {
        question: "هل يمكن إضافة ملفات كبيرة؟",
        answer: "الحد الأقصى حسب إعدادات الـ LMS، غالبًا 500MB–2GB."
      }
    ],
    tips: [
      "استخدم أسماء ملفات واضحة تحتوي على تاريخ ونوع المحتوى لتسهيل البحث لاحقاً."
    ]
  },
  {
    id: TopicId.COURSE_SETUP,
    title: "إنشاء الكورسات",
    description: "خطوات بناء هيكل الكورس والوحدات التعليمية.",
    icon: BookOpen,
    color: "emerald",
    steps: [
      "اختر “Create New Course”.",
      "أدخل اسم الكورس، الوصف، والتواريخ.",
      "أضف الوحدات (Modules) بالترتيب المنطقي.",
      "أضف الموارد لكل وحدة (ملفات، فيديوهات، روابط).",
      "اضبط إعدادات الوصول للموظفين (Groups, Permissions).",
      "اختبر الكورس قبل نشره."
    ],
    faq: [
      {
        question: "كيف أغير ترتيب الوحدات؟",
        answer: "استخدم خاصية Drag & Drop من صفحة الكورس الرئيسية."
      },
      {
        question: "هل يمكن نسخ كورس موجود؟",
        answer: "نعم، استخدم خيار “Duplicate Course” لتوفير الوقت."
      }
    ],
    tips: [
      "قسم الكورس لوحدات صغيرة (Micro-learning) لتسهيل التعلم وزيادة التركيز."
    ]
  },
  {
    id: TopicId.QUIZ_SETUP,
    title: "إنشاء الكويز",
    description: "إعداد الاختبارات والتقييمات وبنك الأسئلة.",
    icon: FileQuestion,
    color: "indigo",
    steps: [
      "اختر “Add Quiz” من القائمة.",
      "أدخل عنوان الكويز، المدة الزمنية، والدرجة القصوى.",
      "اختر نوع الأسئلة: Multiple Choice، True/False، Essay، Matching.",
      "اضبط إعدادات التقييم (Automatic للتصحيح التلقائي أو Manual).",
      "اختر Randomization لخلط الأسئلة.",
      "اضغط Save & Preview للمراجعة."
    ],
    faq: [
      {
        question: "كيف أعدل كويز بعد النشر؟",
        answer: "اذهب للكويز، اضغط Edit Settings ثم Save Changes."
      },
      {
        question: "هل يمكن إعادة استخدام أسئلة؟",
        answer: "نعم، استخدم “Question Bank” لاستيراد أسئلة سابقة."
      }
    ],
    tips: [
      "ادمج أسئلة سهلة ومتوسطة وصعبة لتقييم شامل وموضوعي لمستوى الموظف."
    ]
  },
  {
    id: TopicId.REPORTS,
    title: "استخراج التقارير",
    description: "متابعة أداء الموظفين ونسب إكمال الكورسات.",
    icon: BarChart3,
    color: "purple",
    steps: [
      "اذهب إلى “Reports” في الكورس أو LMS Dashboard.",
      "اختر نوع التقرير (Participation, Quiz Results, Completion).",
      "اضبط التواريخ والفلاتر المطلوبة.",
      "اضغط Export لتحميل الملف بصيغة (PDF/Excel)."
    ],
    faq: [
      {
        question: "كيف أقرأ تقرير التقييم؟",
        answer: "كل صف يمثل موظف، وكل عمود يمثل نتيجة كويز أو وحدة معينة."
      },
      {
        question: "هل يمكن تتبع تقدم كل موظف؟",
        answer: "نعم، استخدم تقرير Completion لرؤية نسب الإنجاز."
      }
    ],
    tips: [
      "استخدم Pivot Table في Excel بعد التصدير لتحليل البيانات بشكل أسرع وأدق."
    ]
  },
  {
    id: TopicId.USERS,
    title: "إدارة المستخدمين",
    description: "إضافة الموظفين وتحديد الصلاحيات والمجموعات.",
    icon: Users,
    color: "blue",
    steps: [
      "اذهب إلى “Users” ثم “Enroll Users”.",
      "أضف الموظفين بالبحث عن الاسم أو البريد، أو أضف مجموعات كاملة.",
      "اضبط صلاحياتهم (Student, Trainer, Admin).",
      "تحقق من وصول البريد الإلكتروني للتأكيد للموظف."
    ],
    faq: [
      {
        question: "ماذا أفعل إذا لم يتمكن المستخدم من الدخول؟",
        answer: "قم بإعادة تعيين كلمة المرور وتأكد من أن حسابه 'Active'."
      }
    ],
    tips: [
      "استخدم Groups (المجموعات) لتسهيل إدارة الأقسام المختلفة في الصيدليات."
    ]
  },
  {
    id: TopicId.TROUBLESHOOTING,
    title: "حل المشكلات",
    description: "دليل سريع للمشاكل التقنية الشائعة وحلولها.",
    icon: AlertTriangle,
    color: "amber",
    steps: [
      "فيديو لا يعمل -> تحقق من نوع الملف (MP4 يفضل) والحجم.",
      "المستخدم لا يرى الكورس -> تحقق من إضافته للـ Group الصحيحة أو الـ Permissions.",
      "الكويز لا يظهر النتائج -> تحقق من إعدادات التقييم (Gradebook Setup)."
    ],
    faq: [],
    tips: [
      "دائماً تأكد من مسح الـ Cache للمتصفح إذا واجهت مشاكل في العرض."
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
You are an expert LMS administrator for United Pharmacies (صيدليات المتحدة).
Your goal is to help staff use the Moodle LMS based ONLY on the following knowledge base.
Answer concisely in Arabic.

Knowledge Base:
${JSON.stringify(TOPICS)}

If the user asks about something not in this list, politely mention you only know about the specific LMS topics listed.
`;