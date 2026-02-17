# AI OKR Feature Documentation

## 🤖 Overview

The AI OKR Generator is a new feature that uses Google Gemini API to automatically generate Objectives and Key Results (OKRs) based on user prompts. Users can describe their business goals in natural language, and the AI will create structured OKRs that can be edited and saved.

## ✨ Features

- **AI-Powered Generation**: Uses Google Gemini 1.5 Flash model to generate OKRs
- **Natural Language Input**: Users describe goals in their own words
- **Editable Results**: Generated OKRs can be edited before saving
- **Batch Creation**: Creates objective and all key results in one operation
- **User-Friendly Interface**: Clean modal interface with loading states and error handling

## 🎯 User Flow

### 1. Access AI Generator
- Click the **"✨ AI OKR"** button in the bottom-right corner of the page
- A modal opens with the AI OKR Generator

### 2. Describe Your Goal
- Enter a prompt describing your business goal or objective
- Example: "Increase customer engagement on our mobile app by improving user retention and feature adoption"
- Click **"Generate OKR"** button

### 3. Review Generated OKRs
The AI generates:
- **Objective**: A clear, inspiring statement
- **Key Results**: 3-5 specific, measurable results with targets and metrics

### 4. Edit (Optional)
- Edit the objective title
- Modify any key result description, target, or metric
- Click **"Generate Again"** to get new suggestions

### 5. Save
- Click **"Save OKR"** to create the objective and all key results
- Objectives are immediately visible in the main list

## 🏗️ Architecture

### Frontend Components

#### **AIGeneratorModal.tsx**
Main component handling the AI OKR generation workflow.

**Location**: `src/components/features/AIGeneratorModal.tsx`

**States**:
- `prompt`: User's goal description
- `isLoading`: Loading state during API calls
- `error`: Error messages
- `generatedOKR`: Initial AI response
- `editedOKR`: User-modified OKR before saving

**Key Functions**:
- `handleGenerateOKR()`: Calls backend to generate OKRs
- `handleEditKeyResult()`: Updates key result fields
- `handleEditObjective()`: Updates objective title
- `handleSubmitOKR()`: Saves objective and key results

#### **Integration in Home.tsx**
```typescript
// State management
const [isAIModalOpen, setIsAIModalOpen] = useState(false);

// Success handler
const handleAIGeneratorSuccess = (newObjective: Objective) => {
  setObjectives((prev) => [...prev, newObjective]);
  setIsAIModalOpen(false);
};

// Button in JSX
<button onClick={() => setIsAIModalOpen(true)}>
  ✨ AI OKR
</button>

// Modal component
<AIGeneratorModal
  isOpen={isAIModalOpen}
  onClose={() => setIsAIModalOpen(false)}
  onSuccess={handleAIGeneratorSuccess}
/>
```

### Backend Services

#### **AiService** (`src/ai/ai.service.ts`)
Handles communication with Google Gemini API.

**Key Method**:
```typescript
async generateOKRs(prompt: string): Promise<GeneratedOKR>
```

**Process**:
1. Takes user prompt as input
2. Creates detailed system prompt for consistent OKR generation
3. Calls Google Gemini API with streaming configuration
4. Parses JSON response
5. Validates response structure
6. Returns structured OKR object

**System Prompt Guidelines**:
- Generates 1 clear objective
- Creates 3-5 measurable key results
- Ensures key results start with action verbs
- Includes specific metrics and targets
- Key results directly support the objective

#### **AiController** (`src/ai/ai.controller.ts`)
Exposes the `/ai/generate-okr` endpoint.

**Endpoint**:
```
POST /ai/generate-okr
Content-Type: application/json

{
  "prompt": "Increase customer engagement..."
}
```

**Response**:
```json
{
  "objective": "Increase mobile app user engagement and retention",
  "keyResults": [
    {
      "description": "Increase daily active users by implementing personalized recommendations",
      "target": 50,
      "metric": "%"
    },
    {
      "description": "Improve 30-day retention rate through improved onboarding",
      "target": 75,
      "metric": "%"
    },
    {
      "description": "Increase average session duration",
      "target": 45,
      "metric": "minutes"
    }
  ]
}
```

#### **AiModule** (`src/ai/ai.module.ts`)
Registers AI service and controller.

## 🔧 Setup & Configuration

### Environment Variables

Add to `.env` file in the backend:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

### Installation (Already Done)

Backend dependencies already configured in `package.json`.

### API Integration Points

**Frontend → Backend**:
- `POST http://localhost:3000/ai/generate-okr`
- `POST http://localhost:3000/objectives` (save objective)
- `POST http://localhost:3000/objectives/:id/key-results` (save key results)

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│  User clicks "✨ AI OKR" button          │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  AIGeneratorModal opens                  │
│  User enters prompt                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  POST /ai/generate-okr with prompt      │
│  (Frontend → Backend)                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  AiService calls Gemini API             │
│  Parses JSON response                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Response sent to Frontend               │
│  Display OKR for user review             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  User edits (optional) and clicks Save   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  POST /objectives (create objective)     │
│  POST /objectives/:id/key-results        │
│  (for each key result)                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  All created in database                 │
│  Modal closes                            │
│  ObjectivesList re-renders               │
│  New OKR appears in list                 │
└─────────────────────────────────────────┘
```

## 🎨 UI Components

### AI OKR Button
- **Location**: Bottom-right corner of the page
- **Style**: Gradient blue-to-purple background
- **Icon**: ✨ (sparkles emoji)
- **Hover Effect**: Scale up, enhanced shadow
- **Fixed Position**: Always visible when scrolling

### Modal States

#### State 1: Input Prompt
```
┌─────────────────────────────────────┐
│ ✨ AI OKR Generator            [✕]  │
├─────────────────────────────────────┤
│ Describe your goal or objective...  │
│                                     │
│ [Large textarea for input]          │
│                                     │
│ [✨ Generate OKR button]            │
└─────────────────────────────────────┘
```

#### State 2: Editing Results
```
┌─────────────────────────────────────┐
│ ✨ AI OKR Generator            [✕]  │
├─────────────────────────────────────┤
│ Objective                           │
│ [textarea with generated objective] │
│                                     │
│ Key Results (3)                     │
│ ┌─────────────────────────────────┐ │
│ │ Description: [input]            │ │
│ │ Target: [100] Metric: [%]       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Description: [input]            │ │
│ │ Target: [50]  Metric: [users]   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Description: [input]            │ │
│ │ Target: [75]  Metric: [%]       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Generate Again] [Save OKR]         │
└─────────────────────────────────────┘
```

## 🔄 Integration with Existing System

### How It Works with ObjectivesList

1. When user saves an AI-generated OKR:
   - Objective is created
   - All key results are created with progress = 0
   - Modal closes
   - `handleAIGeneratorSuccess` adds new objective to state
   - ObjectivesList re-renders

2. The AI-generated OKRs appear in the main list just like manually created ones:
   - Can be edited via the pencil icon
   - Can be deleted via the trash icon
   - Key result progress can be updated
   - Progress calculation works identically

### Callback Pattern

```
AIGeneratorModal
    │
    └─ onSuccess() callback
         │
         └─ handleAIGeneratorSuccess()
              │
              └─ setObjectives((prev) => [...prev, newObjective])
                   │
                   └─ ObjectivesList re-renders with new data
```

## ⚙️ Error Handling

### Frontend Errors
- **No prompt**: "Please enter a prompt"
- **API failure**: Displays error message from backend
- **Invalid response**: Shows user-friendly error
- **Network error**: Caught and displayed

### Backend Errors
- **Missing API key**: Service logs warning but can still initialize
- **Gemini API failure**: Error details passed to frontend
- **Invalid JSON response**: Error parsing caught and reported
- **Missing fields**: Defaults applied (target: 100, metric: "%")

### User Feedback
- Loading spinner during generation
- "Generating..." text on button
- "Saving..." text during submission
- Error messages in red text
- Disabled inputs during loading

## 📝 Example Prompts

### E-commerce
"Increase online sales revenue and customer lifetime value through improved product discovery and checkout optimization"

**Generated OKRs might include**:
- Objective: Increase online revenue and customer retention
- KR1: Increase average order value by 30%
- KR2: Improve checkout completion rate to 85%
- KR3: Increase customer repeat purchase rate to 60%

### SaaS Product
"Improve user adoption and reduce churn for our project management tool"

**Generated OKRs might include**:
- Objective: Maximize user adoption and engagement
- KR1: Increase signup to trial conversion by 40%
- KR2: Reduce 30-day churn rate to 5%
- KR3: Improve daily active user rate to 50%

### Team Productivity
"Streamline internal processes and improve team collaboration"

**Generated OKRs might include**:
- Objective: Improve team efficiency and collaboration
- KR1: Reduce meeting time by 25%
- KR2: Automate 80% of recurring tasks
- KR3: Achieve 95% task completion rate

## 🔐 Security & Best Practices

### API Key Management
- GEMINI_API_KEY stored in `.env` (never committed to git)
- Accessed via ConfigService (NestJS best practice)
- Used only server-side (backend makes API calls)
- Never exposed to frontend

### Rate Limiting (Future Enhancement)
Consider implementing:
- Rate limiting per user/IP
- Maximum prompt length validation
- API call quotas

### Data Validation
- Prompt must not be empty
- Response must have objective and keyResults
- Key results must have description, target, metric
- Defaults applied for missing fields

## 🚀 Performance Considerations

### Current Implementation
- Single Gemini API call per generation
- Synchronous save (creates objective, then key results)
- Modal scrollable for long responses

### Optimization Opportunities
- Batch key result creation (if API supports)
- Caching for similar prompts
- Debounce on rapid regeneration requests
- Progressive loading for large responses

## 🐛 Troubleshooting

### "GOOGLE_API_KEY is not configured"
**Solution**: Add `GOOGLE_API_KEY` to backend `.env` file

### AI generates invalid JSON
**Solution**: The system attempts to extract JSON from response. If failure:
1. Check API key validity
2. Verify Gemini API access
3. Check internet connection
4. Retry with clearer prompt

### OKRs not appearing after save
**Solution**:
1. Check network tab for failed requests
2. Verify backend is running on port 3000
3. Check browser console for errors
4. Verify database connection

### Modal closes but OKR not created
**Solution**:
1. Check backend logs for database errors
2. Verify objectives table exists
3. Check for unique constraint violations

## 📚 Files Modified/Created

### New Files
```
backend/src/ai/ai.service.ts      - AI OKR generation logic
backend/src/ai/ai.controller.ts   - API endpoint
backend/src/ai/ai.module.ts       - Module configuration
frontend/src/components/features/AIGeneratorModal.tsx - UI component
```

### Modified Files
```
backend/src/app.module.ts          - Added AiModule import
frontend/src/pages/Home.tsx        - Added AI button and modal integration
```

## 🔗 Related Documentation

- Backend API Endpoint: `/ai/generate-okr` (POST)
- Frontend Components: `ObjectiveForm`, `KeyResultForm`, `Modal`
- State Management: Props drilling from Home.tsx
- Progress Calculation: Works identically for AI-generated OKRs

## 📈 Future Enhancements

1. **Multiple Objectives**: Generate multiple objectives at once
2. **Templates**: Predefined templates for industries (SaaS, E-commerce, etc.)
3. **Refinement**: Refine generated OKRs with follow-up prompts
4. **Comparison**: Compare AI-generated vs manually created OKRs
5. **Analytics**: Track success rate of AI-generated OKRs
6. **Feedback**: Improve AI with user feedback on generated OKRs
7. **Historical**: Show past AI generations and their results
