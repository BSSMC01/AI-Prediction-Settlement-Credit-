import React from 'react';
import { SectionType, DocumentSection } from '../types';
import { 
  Target, 
  Layers, 
  Database, 
  Cpu, 
  Server, 
  GitMerge, 
  Rocket,
  Wand2
} from 'lucide-react';

export const documentData: DocumentSection[] = [
  {
    id: 'goals',
    title: '1. 项目背景 & 目标 (Goals)',
    icon: <Target className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        title: '项目愿景',
        content: 'Bosen AI 信贷评分与贷款重组系统旨在提升 BSSMC GROUP 贷款咨询与重组服务的数字化核心能力。通过 "Hybrid Intelligence" 架构，将资深顾问的经验转化为可扩展的算法逻辑。'
      },
      {
        type: SectionType.LIST,
        title: '四大核心目标 (Core Objectives)',
        content: [
          '数字化 & 智能化：实现从 "人工阅读 PDF" 到 "系统自动解析 + 结构化入库" 的转型。',
          '评估精准度：基于客户真实的 Experian (CCRIS) + CTOS 数据，利用 ML 模型预测银行批核率，消除"凭感觉"判断。',
          '顾问效率倍增：自动生成深度分析报告 (PDF) 与高转化率的 WhatsApp 沟通文案，让顾问专注于客户关系而非文书。',
          '方案成功率：通过 Simulation Engine 自动模拟 "50% - 70% 月供降低" 的重组策略，找出最优还款组合。'
        ]
      }
    ]
  },
  {
    id: 'architecture',
    title: '2. 架构总览 (Architecture)',
    icon: <Layers className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        content: '系统采用 "双核驱动" (Dual-Core) 架构：BSSMC LLM 处理非结构化理解与生成，BSSMC ML 处理严谨的金融风控预测，Rule Engine 兜底硬性合规逻辑。'
      },
      {
        type: SectionType.ARCHITECTURE,
        title: 'Bosen AI System Architecture',
        data: {
          layers: [
            { name: "Presentation Layer (Consultant & Client)", items: ["Web Portal", "Mobile App", "WhatsApp Bot"] },
            { name: "BSSMC LLM Layer (Unstructured)", items: ["PDF Report Parser (OCR)", "Pattern Summarizer", "Comm Generator (Copywriting)"], highlight: true },
            { name: "BSSMC ML Layer (Structured Logic)", items: ["Risk Scoring Model (0-100)", "Approval Probability Predictor", "Financial Logic IP"] },
            { name: "Deterministic Engines", items: ["Rule Engine (Policy Filter)", "Repayment Simulation Engine (Math)"] },
            { name: "Data Infrastructure", items: ["Vector DB (Policies)", "PostgreSQL (Customer Profiles)", "Object Storage (PDFs)"] }
          ]
        }
      }
    ]
  },
  {
    id: 'datastructure',
    title: '3. 数据结构 (ML Data Schema)',
    icon: <Database className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        content: '核心数据结构围绕 "Customer Credit Profile" 构建，Feature Builder 负责将原始 JSON 清洗为 ML 模型可读的 Feature Vector。'
      },
      {
        type: SectionType.TABLE,
        title: 'Machine Learning Input Features',
        data: {
          headers: ["Feature Name", "Type", "Source", "Description", "Importance"],
          rows: [
            ["ccris_12m_payment_vector", "Vector[12]", "Experian", "Rolling 12-month payment history (0=Clean, 1=Late)", "Critical"],
            ["dsr_consolidated", "Float", "Calculation", "Debt Service Ratio after simulated consolidation", "High"],
            ["unsecured_utilization", "Float", "Experian", "Ratio of Credit Card usage limit", "High"],
            ["ctos_legal_flags", "Boolean", "CTOS", "Presence of bankruptcy/litigation/trade referee", "Critical"],
            ["income_stability_score", "Integer", "User Input", "Score based on employment type & document strength", "Medium"],
            ["bosen_internal_risk", "Integer", "ML Output", "Predicted Risk Score (0-100)", "Target"]
          ]
        }
      },
      {
        type: SectionType.CODE,
        title: 'Standardized Feature Object (TypeScript)',
        language: 'typescript',
        code: `interface CreditFeatureVector {
  // Parsed from PDF
  bureauData: {
    ccris_arrears_max: number; // Max arrears in last 12 months
    total_outstanding_unsecured: number;
    total_outstanding_secured: number;
    special_attention_account: boolean; // SAA flag
    legal_action_status: 'CLEAR' | 'LITIGATION' | 'BANKRUPTCY';
  };
  
  // Financial Computation
  financials: {
    monthly_net_income: number;
    current_commitment: number;
    new_simulated_commitment: number;
    dsr_current: number; // 0.0 - 1.0
    dsr_projected: number; // 0.0 - 1.0
  };

  // ML Prediction Target
  prediction: {
    bosen_score: number; // 0-100
    approval_probability: number; // 0.0 - 1.0
    suggested_strategy: 'DEBT_CONSOL' | 'RESTRUCTURE' | 'REJECT';
  }
}`
      }
    ]
  },
  {
    id: 'modules',
    title: '4. 模块说明 (Module Specification)',
    icon: <Cpu className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        content: '本章节详细定义系统的各个核心处理模块，重点阐述 Report Parsing Layer 的输入输出标准，以及 Feature Builder 的数据转换逻辑。'
      },
      {
        type: SectionType.TEXT,
        title: '4.1 Report Parsing Layer (信用报告解析层)',
        content: '该层作为数据入口，利用 Gemini 1.5 Pro 的多模态能力，解决传统 OCR 无法处理复杂金融表格（错位、合并单元格）的痛点。'
      },
      {
        type: SectionType.LIST,
        title: '核心功能 & 输入 (Core Functions & Inputs)',
        content: [
          '输入源：接受用户上传的 CTOS PDF 报告与 Experian (IRISS + ISUPP) 报告，支持扫描件 (Image-based PDF)。',
          'LLM 解析引擎：使用 Gemini 1.5 Pro 视觉模型读取整个页面，识别表格边界与关键字段。',
          '输出目标：生成标准化的 JSON 结构，统一不同来源的字段命名 (e.g., "Total Outstanding" vs "Total Balance")。'
        ]
      },
      {
        type: SectionType.CODE,
        title: 'Standardized Parsing Output (JSON Example)',
        language: 'json',
        code: `{
  "meta": {
    "parsing_engine": "Gemini-1.5-Pro",
    "confidence_score": 0.98,
    "timestamp": "2023-10-27T10:00:00Z"
  },
  "ctos_parsed": {
    "summary": {
      "ctos_score": 720,
      "litigation_count": 0,
      "bankruptcy_status": "CLEAR"
    },
    "critical_flags": {
      "special_attention_account": false,
      "trade_referee_listings": 1
    }
  },
  "experian_parsed": {
    "risk_profile": {
      "i_score": 645,
      "risk_grade": "Fair"
    },
    "banking_info": {
      "total_outstanding_unsecured": 45000.00,
      "total_outstanding_secured": 350000.00,
      "ccris_facilities": [
        {
          "bank": "MBB",
          "type": "Credit Card",
          "limit": 20000,
          "outstanding": 18500,
          "payment_pattern_12m": "001000100000" // Pattern analysis target
        }
      ]
    },
    "employment_history": [
      { "employer": "Tech Corp", "tenure_years": 2 },
      { "employer": "Old Agency", "tenure_years": 4 }
    ]
  }
}`
      },
      {
        type: SectionType.TEXT,
        title: '4.2 Feature Builder Layer (特征生成层)',
        content: '负责将 Report Parsing Layer 的原始 JSON 输出与顾问录入的人工资料结合，转换为机器学习模型（ML Model）可读取的标准化数值向量（Feature Vector）。'
      },
      {
        type: SectionType.LIST,
        title: '核心功能 (Core Functions)',
        content: [
          'Pattern Recognition: 解析 CCRIS "001020" 字符串，提取最大逾期数 (Max MIA) 与近期趋势。',
          'Normalization: 统一不同来源的收入字段，清洗非结构化地址为 State/Area 代码。',
          'Feature Engineering: 计算 DSR (Debt Service Ratio)、Unsecured Utilization 等衍生特征。',
          'Formatting: 输出 Pandas/Numpy 兼容的 Array 格式供预测模型使用。'
        ]
      },
      {
        type: SectionType.TABLE,
        title: 'Feature Categories (特征类别矩阵)',
        data: {
          headers: ["Category", "Key Features", "Source"],
          rows: [
            ["Profile Info", "Age, State, Marital Status, Education", "User Input"],
            ["Income & Employment", "Net Income, Job Tenure (Years), Job Changes (Count)", "User Input / Docs"],
            ["Exposure", "Total Unsecured, Total Secured, No. of Facilities", "Experian/CTOS"],
            ["Repayment Behaviour", "Max MIA (12m), Avg Lag, Payment Trend Slope", "CCRIS Pattern"],
            ["Risk Flags", "Legal Status, Special Attention Account (SAA), Trade Referee", "CTOS"],
            ["Experian Risk", "i-Score, Risk Grade (1-10), Risk Bucket", "Experian"],
            ["Application Behaviour", "Recent Enquiries (3m/6m), New Facilities Approved", "Experian"],
            ["Assets", "Property Count, Car Value (Estimated)", "User Input"],
            ["ML Label", "Internal Risk Grade (Target Variable for Training)", "BSSMC History"]
          ]
        }
      },
      {
        type: SectionType.LIST,
        title: '4.3 Downstream Engines (后续核心引擎)',
        content: [
          'Rule Engine: 硬性准入规则过滤 (e.g., Bankruptcy Check)。',
          'BSSMC ML Engine: 接收 Feature Vector，输出批核概率。',
          'Repayment Simulation Engine: 计算重组后的月供优化方案。'
        ]
      }
    ]
  },
  {
    id: 'api',
    title: '5. API 设计 (Interface)',
    icon: <Server className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        title: 'Input Validation Strategy',
        content: '为了确保系统的安全性与数据完整性，所有 API 端点都通过 Middleware 实施严格的输入验证 (Input Validation)。系统将自动拒绝不符合预定义 Schema 的请求。'
      },
      {
        type: SectionType.LIST,
        title: 'Validation Standard',
        content: [
          'Schema Validation: 使用 Zod (Node.js) 或 Pydantic (Python) 定义严格的数据类型和格式。',
          'File Validation: 严格限制上传文件类型 (PDF, Image) 与大小 (Max 15MB)。',
          'Sanitization: 自动清除文本字段中的潜在 XSS 脚本或 SQL 注入字符。',
          'Error Handling: 验证失败时返回 HTTP 400/422 及具体的错误字段说明。'
        ]
      },
      {
        type: SectionType.API,
        title: 'Key System Endpoints Specification',
        data: [
          {
            method: 'POST',
            path: '/api/v1/ingest/report',
            summary: 'Upload & Parse PDF Report',
            request: 'FormData (Strict Validation):\n- files: File[] (Required, Max 10MB, Type: application/pdf, image/*)\n- type: Enum<"EXPERIAN" | "CTOS"> (Required)',
            response: '200 OK: { raw_json: {...} }\n400 Bad Request: {\n  "code": "INVALID_FILE_TYPE",\n  "message": "Only PDF or Image files are allowed."\n}'
          },
          {
            method: 'POST',
            path: '/api/v1/engine/evaluate',
            summary: 'Get Bosen Score & ML Prediction',
            request: 'JSON Body (Schema: EvaluationRequest):\n{\n  "customer_financials": {\n    "net_income": number (min: 1000),\n    "commitments": number (min: 0)\n  },\n  "parsed_bureau_data": object (Required structure)\n}',
            response: '200 OK: { bosen_score: 78, ... }\n422 Validation Error: {\n  "loc": ["body", "customer_financials", "net_income"],\n  "msg": "Income must be greater than 1000"\n}'
          },
          {
            method: 'POST',
            path: '/api/v1/simulation/optimize',
            summary: 'Run Debt Restructuring Simulation',
            request: 'JSON Body:\n{\n  "liabilities": Array<LiabilityObj> (min_items: 1),\n  "target_dsr": number (range: 0.1 - 0.85)\n}',
            response: '200 OK: { strategies: [...] }\n400 Bad Request: { "message": "Target DSR cannot be lower than 10%." }'
          },
          {
            method: 'POST',
            path: '/api/v1/llm/generate-comm',
            summary: 'Generate Report & WhatsApp Msg',
            request: 'JSON Body:\n{\n  "analysis_id": UUID (Required, must exist in DB),\n  "tone": Enum<"EMPATHETIC" | "PROFESSIONAL">\n}',
            response: '200 OK: { whatsapp_text: "..." }\n404 Not Found: { "message": "Analysis ID provided does not exist." }'
          }
        ]
      }
    ]
  },
  {
    id: 'flow',
    title: '6. 系统流程 (System Flow)',
    icon: <GitMerge className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.FLOW,
        title: 'End-to-End Deal Processing Flow',
        data: {
          steps: [
            { id: 1, label: "Input: 上传 Experian/CTOS PDF 报告" },
            { id: 2, label: "Gemini/OpenAI: OCR 解析 & 结构化 (JSON)" },
            { id: 3, label: "Feature Builder: 数据清洗 & 规则预审" },
            { id: 4, label: "BSSMC ML Engine: 生成评分 (Risk Score)" },
            { id: 5, label: "Simulation Engine: 模拟降月供方案 (A/B/C)" },
            { id: 6, label: "LLM Layer: 生成顾问报告 & 客户文案" },
            { id: 7, label: "Output: 顾问 App 展示 & 提交银行" }
          ]
        }
      }
    ]
  },
  {
    id: 'deployment',
    title: '7. 部署方案 (Deployment)',
    icon: <Rocket className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        content: '采用渐进式部署策略，兼顾成本、速度与数据隐私。'
      },
      {
        type: SectionType.LIST,
        title: 'Phase 1: Hybrid Cloud (MVP)',
        content: [
          'LLM: 调用 OpenAI GPT-4o 或 Gemini 1.5 Pro API (处理脱敏数据) 快速实现解析与文案生成。',
          'ML Model: scikit-learn/XGBoost 模型部署在私有云容器 (Docker) 中，确保核心算法 IP 不外泄。',
          'Database: PostgreSQL (RDS) 存储结构化业务数据。'
        ]
      },
      {
        type: SectionType.LIST,
        title: 'Phase 2: Self-Hosted Optimization (Scale)',
        content: [
          'LLM: 微调开源模型 (如 Llama 3 8B) 并私有化部署，降低 API 成本并提升数据隐私等级。',
          'Training Pipeline: 建立自动化的 MLOps 流程，利用顾问修正后的真实批核结果，每季度自动重训 ML 模型，提升评分准确度。'
        ]
      }
    ]
  },
  {
    id: 'image-engine',
    title: '8. Prototype: Image Tools',
    icon: <Wand2 className="w-5 h-5" />,
    blocks: [
      {
        type: SectionType.TEXT,
        content: '本模块演示了 Report Parsing Layer 中使用的图像增强技术原型。顾问可以使用此工具清理、增强或注释扫描的文档图像。'
      },
      {
        type: SectionType.IMAGE_EDITOR,
        title: 'Gemini 2.5 Flash Image - Interactive Editor',
      },
      {
        type: SectionType.TEXT,
        title: 'Usage Instructions',
        content: '上传报告扫描件（截图），输入增强指令（例如："Increase contrast for better OCR" 或 "Highlight the Total Outstanding amount"），系统将返回处理后的图像。'
      }
    ]
  }
];