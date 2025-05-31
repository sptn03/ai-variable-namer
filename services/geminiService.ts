
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// FIX: Removed syntactically incorrect and redundant import for 'SuggestedName'.
// The type is correctly accessed via the 'ParsedSuggestedName' type alias (import('../types').SuggestedName),
// which resolves potential linter issues and clarifies type usage. The original problematic line was:
// import { SuggestedName }_ from '../types'; // Renamed to avoid conflict with local SuggestedName type
import { GEMINI_MODEL_TEXT } from '../constants';

// This is a workaround for the linter potentially flagging SuggestedName from types.ts as unused if not explicitly used.
// We will use a local type for the return type of the parse function for clarity.
type ParsedSuggestedName = import('../types').SuggestedName;


const getApiKey = (): string => {
  const apiKey = 'AIzaSyDdeY1zctftQR7kAsBQfCPKvVlMR6Wl7s4';
  if (!apiKey) {
    console.error("API_KEY environment variable is not set.");
    throw new Error("API_KEY environment variable is not set. Please configure it in your environment.");
  }
  return apiKey;
};


let ai: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey: getApiKey() });
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      throw new Error("Failed to initialize AI service. Is the API Key valid and configured?");
    }
  }
  return ai;
};

const constructPrompt = (description: string): string => {
  return `
Bạn là một trợ lý AI chuyên về đặt tên trong lập trình.
Dựa trên mô tả ý nghĩa của biến/hằng bằng tiếng Việt sau:

"${description}"

Hãy đề xuất 5 đến 7 tên tiếng Anh ngắn gọn, súc tích và có ý nghĩa nhất cho biến/hằng này.
Đối với mỗi tên gốc (base name) được đề xuất, hãy cung cấp các biến thể theo các quy ước đặt tên phổ biến sau:
1.  \`camelCase\` (ví dụ: \`myVariableName\`)
2.  \`PascalCase\` (ví dụ: \`MyClassNameOrComponent\`)
3.  \`snake_case\` (ví dụ: \`my_variable_name\`)
4.  \`SCREAMING_SNAKE_CASE\` (ví dụ: \`MY_CONSTANT_VALUE\`)

Quan trọng: Kết quả phải được trả về dưới dạng một mảng (array) các đối tượng JSON. Mỗi đối tượng trong mảng phải tuân theo cấu trúc sau:
{
  "baseName": "string",
  "camelCase": "string",
  "pascalCase": "string",
  "snakeCase": "string",
  "screamingSnakeCase": "string"
}

Ví dụ, nếu mô tả là "biến lưu tổng số sản phẩm trong giỏ hàng", một phần tử trong mảng JSON kết quả có thể là:
{
  "baseName": "total products in cart",
  "camelCase": "totalProductsInCart",
  "pascalCase": "TotalProductsInCart",
  "snakeCase": "total_products_in_cart",
  "screamingSnakeCase": "TOTAL_PRODUCTS_IN_CART"
}

Hãy đảm bảo các tên đề xuất tự nhiên, dễ hiểu trong ngữ cảnh lập trình tiếng Anh và tuân thủ chính xác định dạng JSON đã yêu cầu.
Đừng bao gồm bất kỳ giải thích nào khác ngoài mảng JSON.
`;
};

const parseGeminiResponse = (responseText: string): ParsedSuggestedName[] => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^\s*```json\s*\n?(.*?)\n?\s*```\s*$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  } else {
    // Fallback for cases where only ``` is used without 'json'
    const simplerFenceRegex = /^\s*```\s*\n?(.*?)\n?\s*```\s*$/s;
    const simplerMatch = jsonStr.match(simplerFenceRegex);
    if (simplerMatch && simplerMatch[1]) {
      jsonStr = simplerMatch[1].trim();
    }
  }

  try {
    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData) && parsedData.every(item => 
      typeof item === 'object' && 
      item !== null &&
      'baseName' in item &&
      'camelCase' in item &&
      'pascalCase' in item &&
      'snakeCase' in item &&
      'screamingSnakeCase' in item
    )) {
      return parsedData as ParsedSuggestedName[];
    }
    console.error("Parsed data is not an array of SuggestedName:", parsedData);
    throw new Error("AI response format is invalid. Expected an array of name suggestions.");
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Raw response:", jsonStr);
    throw new Error("Failed to parse AI response. The response was not valid JSON.");
  }
};

export const generateNamingSuggestions = async (description: string): Promise<ParsedSuggestedName[]> => {
  if (!description.trim()) {
    return Promise.resolve([]);
  }

  const localAI = getAIInstance();
  const prompt = constructPrompt(description);

  try {
    const response: GenerateContentResponse = await localAI.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // temperature: 0.7, // Adjust for creativity vs. predictability
      },
    });
    
    const responseText = response.text;
    if (!responseText) {
        throw new Error("Received empty response from AI.");
    }
    return parseGeminiResponse(responseText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Check for specific API key related messages if possible, though SDK might obscure them
        if (error.message.toLowerCase().includes("api key") || error.message.toLowerCase().includes("permission denied")) {
             throw new Error("AI API request failed. Please check your API Key and permissions.");
        }
        throw new Error(`AI service error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching suggestions.");
  }
};
