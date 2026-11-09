export type Language = 'ar' | 'en';

export interface WorkflowTemplate {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  badge: string;
  trigger: string;
  runtime: 'node' | 'python' | 'curl';
  yaml: string;
  companionScript?: {
    filename: string;
    code: string;
    language: string;
  };
  explanation: { ar: string; en: string };
}

export interface SetupStep {
  id: string;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  details: { ar: string; en: string };
  codeSnippet?: string;
  codeLang?: string;
  tip?: { ar: string; en: string };
}

export interface ReviewResponse {
  success: boolean;
  review: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini' | 'system';
  text: string;
  timestamp: string;
}
