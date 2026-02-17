# Frontend Flow Explanation

## 🎯 Complete Application Flow

This document explains how the entire frontend application works - from data fetching to state management to progress calculation.

---

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         main.tsx                             │
│                  (Application Entry Point)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       pages/Home.tsx                         │
│                   (Main State Container)                     │
│                                                               │
│  States:                                                      │
│  • objectives: Objective[]                                   │
│  • isLoading: boolean                                        │
│  • editingObjective: Objective | null                        │
│  • isObjectiveModalOpen: boolean                             │
│  • isKeyResultModalOpen: boolean                             │
│  • keyResultObjectiveId: number | null                       │
└──────────────┬───────────────────────┬────────────────────┬─┘
               │                       │                    │
               ▼                       ▼                    ▼
┌──────────────────┐    ┌────────────────────┐    ┌───────────────┐
│ ObjectivesList   │    │  ObjectiveForm     │    │ KeyResultForm │
│   (Display)      │    │   (in Modal)       │    │  (in Modal)   │
└──────────────────┘    └────────────────────┘    └───────────────┘
```

---

## 🔄 Data Flow Step-by-Step

### **1. Application Startup**

```
main.tsx
  ↓
Renders <Home /> component
  ↓
Home.tsx useEffect() triggers
  ↓
fetchObjectives() called
  ↓
GET http://localhost:3000/objectives
  ↓
setObjectives(data) - Updates state
  ↓
ObjectivesList re-renders with data
```

**Code:**
```typescript
// main.tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);

// Home.tsx
useEffect(() => {
  fetchObjectives();
}, []);

const fetchObjectives = async () => {
  setIsLoading(true);
  const response = await fetch("http://localhost:3000/objectives");
  const data = await response.json();
  setObjectives(data);  // ← State updated here
  setIsLoading(false);
};
```

---

### **2. Creating a New Objective**

```
User clicks "Add Objective" button in Home.tsx
  ↓
setIsObjectiveModalOpen(true)
  ↓
Modal opens with ObjectiveForm inside
  ↓
User enters objective title
  ↓
User clicks "Add" button
  ↓
ObjectiveForm: handleSubmit() called
  ↓
POST http://localhost:3000/objectives
  ↓
onSuccess() callback fired
  ↓
Back to Home.tsx: handleObjectiveSuccess()
  ↓
fetchObjectives() - Refresh data from backend
  ↓
handleCloseObjectiveModal() - Close modal
  ↓
ObjectivesList re-renders with new data
```

**Code Flow:**
```typescript
// Home.tsx - Button click
<button onClick={() => setIsObjectiveModalOpen(true)}>
  Add Objective
</button>

// Modal renders when isObjectiveModalOpen === true
<Modal isOpen={isObjectiveModalOpen}>
  <ObjectiveForm
    onClose={handleCloseObjectiveModal}
    onSuccess={handleObjectiveSuccess}  // ← Callback
  />
</Modal>

// ObjectiveForm.tsx - Form submission
const handleSubmit = async (e) => {
  const response = await fetch("http://localhost:3000/objectives", {
    method: "POST",
    body: JSON.stringify({ title: title.trim() }),
  });
  
  if (response.ok) {
    onSuccess();  // ← Calls handleObjectiveSuccess in Home
  }
};

// Home.tsx - Success callback
const handleObjectiveSuccess = () => {
  fetchObjectives();              // ← Refresh from backend
  handleCloseObjectiveModal();    // ← Close modal
};
```

---

### **3. Editing an Objective**

```
User clicks edit icon (pencil) on an objective
  ↓
handleEditObjective(objective) called in Home.tsx
  ↓
setEditingObjective(objective) - Store which one to edit
  ↓
setIsObjectiveModalOpen(true) - Open modal
  ↓
Modal opens with ObjectiveForm
  ↓
ObjectiveForm receives editData prop (the objective)
  ↓
Form pre-fills with objective.title
  ↓
User edits and clicks "Update"
  ↓
PATCH http://localhost:3000/objectives/:id
  ↓
onSuccess() → fetchObjectives() → Modal closes
  ↓
ObjectivesList re-renders with updated data
```

**Code Flow:**
```typescript
// ObjectivesList.tsx - Edit button
<button onClick={() => onEdit(objective)}>
  <Pencil />
</button>

// Home.tsx - Edit handler
const handleEditObjective = (objective: Objective) => {
  setEditingObjective(objective);     // ← Store objective to edit
  setIsObjectiveModalOpen(true);      // ← Open modal
};

// ObjectiveForm receives the data
<ObjectiveForm
  editData={editingObjective || undefined}  // ← Passed as prop
  onSuccess={handleObjectiveSuccess}
/>

// ObjectiveForm.tsx - Pre-fills form
const [title, setTitle] = useState(editData?.title ?? "");
const isEditMode = Boolean(editData);

// On submit, uses PATCH if editing
const url = isEditMode 
  ? `http://localhost:3000/objectives/${editData?.id}`
  : "http://localhost:3000/objectives";
const method = isEditMode ? "PATCH" : "POST";
```

---

### **4. Deleting an Objective**

```
User clicks delete icon (trash) on an objective
  ↓
handleDeleteObjective(event, id) called in ObjectivesList
  ↓
Confirmation dialog shown: "Are you sure?"
  ↓
User confirms
  ↓
DELETE http://localhost:3000/objectives/:id
  ↓
onRefresh() callback fired
  ↓
Back to Home.tsx: fetchObjectives()
  ↓
ObjectivesList re-renders without deleted item
```

**Code Flow:**
```typescript
// ObjectivesList.tsx - Delete button
<button onClick={(event) => handleDeleteObjective(event, objective.id)}>
  <Trash2 />
</button>

// ObjectivesList.tsx - Delete handler
const handleDeleteObjective = async (event, id) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!confirm("Are you sure you want to delete this objective?")) {
    return;  // ← User cancelled
  }
  
  const response = await fetch(`http://localhost:3000/objectives/${id}`, {
    method: "DELETE",
  });
  
  if (response.ok) {
    onRefresh();  // ← Calls fetchObjectives in Home.tsx
  }
};

// Home.tsx - Passed as prop
<ObjectivesList
  objectives={objectives}
  onRefresh={fetchObjectives}  // ← Callback to refresh data
/>
```

---

### **5. Adding a Key Result**

```
User clicks "+ Add Key Result" button on an objective
  ↓
handleAddKeyResult(objective) called in Home.tsx
  ↓
setKeyResultObjectiveId(objective.id)
  ↓
setIsKeyResultModalOpen(true)
  ↓
Modal opens with KeyResultForm
  ↓
User fills in:
  • Description
  • Current Progress (default: 0)
  • Target (default: 100)
  • Metric (default: "%")
  ↓
User clicks "Save"
  ↓
POST http://localhost:3000/objectives/:id/key-results
  ↓
onSuccess() → fetchObjectives() → Modal closes
  ↓
ObjectivesList re-renders with new key result
```

**Code Flow:**
```typescript
// ObjectivesList.tsx - Add key result button
<button onClick={() => onAddKeyResult(objective)}>
  + Add Key Result
</button>

// Home.tsx - Handler
const handleAddKeyResult = (objective: Objective) => {
  setKeyResultObjectiveId(objective.id);  // ← Store which objective
  setIsKeyResultModalOpen(true);          // ← Open modal
};

// KeyResultForm is rendered with objectiveId
<KeyResultForm
  isOpen={isKeyResultModalOpen}
  objectiveId={keyResultObjectiveId}  // ← Tells which objective
  onSuccess={handleKeyResultSuccess}
/>

// KeyResultForm.tsx - Save handler
const handleSave = async () => {
  const response = await fetch(
    `http://localhost:3000/objectives/${objectiveId}/key-results`,
    {
      method: "POST",
      body: JSON.stringify({
        description: description.trim(),
        progress: progressValue,
        target: targetValue,
        metric: metricValue,
      }),
    }
  );
  
  if (response.ok) {
    onSuccess();  // ← Calls handleKeyResultSuccess in Home
  }
};
```

---

### **6. Updating Key Result Progress**

```
User changes progress value in input field
  ↓
onChange event fires in ObjectivesList
  ↓
handleUpdateKeyResultProgress(objectiveId, keyResultId, newProgress)
  ↓
setUpdatingKeyResult(`${objectiveId}-${keyResultId}`) - Show loading
  ↓
PATCH http://localhost:3000/objectives/:id/key-results/:krId
  ↓
Backend updates progress
  ↓
onRefresh() → fetchObjectives()
  ↓
ObjectivesList re-renders with updated progress
  ↓
Progress bars update automatically
  ↓
Objective overall progress recalculates
```

**Code Flow:**
```typescript
// ObjectivesList.tsx - Progress input
<input
  type="number"
  value={keyResult.progress}
  onChange={(event) => {
    const newValue = Number(event.target.value) || 0;
    handleUpdateKeyResultProgress(
      objective.id,
      keyResult.id,
      newValue
    );
  }}
  disabled={isUpdating}
/>

// ObjectivesList.tsx - Update handler
const handleUpdateKeyResultProgress = async (
  objectiveId: number,
  keyResultId: number,
  newProgress: number,
) => {
  const updateKey = `${objectiveId}-${keyResultId}`;
  setUpdatingKeyResult(updateKey);  // ← Show "Updating..." indicator
  
  try {
    const response = await fetch(
      `http://localhost:3000/objectives/${objectiveId}/key-results/${keyResultId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      }
    );
    
    if (response.ok) {
      onRefresh();  // ← Fetch fresh data from backend
    }
  } finally {
    setUpdatingKeyResult(null);  // ← Remove loading indicator
  }
};
```

---

## 🧮 Progress Calculation Logic

### **Key Result Progress (Individual)**

```typescript
const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};
```

**Example:**
- Current: 7, Target: 10 → 70%
- Current: 10, Target: 10 → 100%
- Current: 15, Target: 10 → 100% (capped at 100%)
- Current: 5, Target: 0 → 0% (avoid division by zero)

### **Objective Progress (Overall)**

The objective progress is the **average** of all its key results' progress.

```typescript
const objectiveProgress =
  objective.keyResults.length === 0
    ? 0  // ← No key results = 0%
    : Math.round(
        objective.keyResults.reduce((sum, keyResult) => {
          const progress = calculateProgress(
            keyResult.progress,
            keyResult.target
          );
          return sum + progress;
        }, 0) / objective.keyResults.length  // ← Average
      );
```

**Example:**

Objective has 3 key results:
- KR1: 50/100 → 50%
- KR2: 30/100 → 30%
- KR3: 100/100 → 100%

Objective Progress = (50 + 30 + 100) / 3 = **60%**

### **Visual Indicators**

```typescript
const isComplete = objectiveProgress >= 100;

// Styling changes based on completion
className={`
  ${isComplete 
    ? "border-gray-300 bg-gray-50"      // ← Grayed out when complete
    : "border-green-400 bg-white"        // ← Active/green when in progress
  }
`}
```

---

## 🔄 State Management Flow

### **Props Drilling Pattern**

```
Home.tsx (State Owner)
  │
  ├─ objectives: Objective[]           ← Main data
  ├─ isLoading: boolean                ← UI state
  ├─ editingObjective: Objective|null  ← Modal data
  ├─ isObjectiveModalOpen: boolean     ← Modal visibility
  ├─ isKeyResultModalOpen: boolean     ← Modal visibility
  └─ keyResultObjectiveId: number|null ← Modal data
  
Passed down as props ↓

┌─────────────────────────────────────────────┐
│           ObjectivesList.tsx                │
│                                             │
│  Receives:                                  │
│  • objectives (data)                        │
│  • onRefresh (callback)                     │
│  • onEdit (callback)                        │
│  • onAddKeyResult (callback)                │
│                                             │
│  Calls back to Home when:                   │
│  • User clicks edit → onEdit(objective)     │
│  • User clicks delete → onRefresh()         │
│  • User adds KR → onAddKeyResult(objective) │
│  • User updates progress → onRefresh()      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           ObjectiveForm.tsx                 │
│                                             │
│  Receives:                                  │
│  • editData (optional)                      │
│  • onClose (callback)                       │
│  • onSuccess (callback)                     │
│                                             │
│  Internal state:                            │
│  • title: string                            │
│  • error: string                            │
│  • isSubmitting: boolean                    │
│                                             │
│  Calls back to Home when:                   │
│  • User closes → onClose()                  │
│  • Save successful → onSuccess()            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           KeyResultForm.tsx                 │
│                                             │
│  Receives:                                  │
│  • isOpen (visibility)                      │
│  • objectiveId (which objective)            │
│  • onClose (callback)                       │
│  • onSuccess (callback)                     │
│                                             │
│  Internal state:                            │
│  • description: string                      │
│  • progress: string                         │
│  • target: string                           │
│  • metric: string                           │
│  • error: string                            │
│  • isSubmitting: boolean                    │
│                                             │
│  Calls back to Home when:                   │
│  • User closes → onClose()                  │
│  • Save successful → onSuccess()            │
└─────────────────────────────────────────────┘
```

---

## 🎬 Complete User Journey Example

Let's trace a complete user journey: **Creating an objective and adding a key result**

### Step 1: User opens the app
```
1. Browser loads index.html
2. main.tsx runs
3. Home component mounts
4. useEffect triggers fetchObjectives()
5. API call: GET /objectives
6. Response: [] (empty array)
7. State: setObjectives([])
8. UI shows: "No objectives yet. Create your first one!"
```

### Step 2: User clicks "Add Objective"
```
9. onClick fires in Home.tsx
10. State: setIsObjectiveModalOpen(true)
11. Modal component receives isOpen={true}
12. Modal renders (visible with backdrop)
13. ObjectiveForm renders inside modal
14. Form shows empty input field
```

### Step 3: User types "Increase Revenue"
```
15. onChange fires on input
16. ObjectiveForm state: setTitle("Increase Revenue")
17. Input value updates in real-time
```

### Step 4: User clicks "Add" button
```
18. onSubmit fires in ObjectiveForm
19. Validation passes (title is not empty)
20. State: setIsSubmitting(true)
21. Button shows "Saving..." and becomes disabled
22. API call: POST /objectives { title: "Increase Revenue" }
23. Backend creates objective with id: 1
24. Response: { id: 1, title: "Increase Revenue", keyResults: [] }
25. State: setIsSubmitting(false)
26. onSuccess() callback fires
27. Jumps to Home.tsx → handleObjectiveSuccess()
28. fetchObjectives() called
29. API call: GET /objectives
30. Response: [{ id: 1, title: "Increase Revenue", keyResults: [] }]
31. State: setObjectives([...])
32. handleCloseObjectiveModal() called
33. State: setIsObjectiveModalOpen(false), setEditingObjective(null)
34. Modal disappears
35. ObjectivesList re-renders
36. Shows: "Increase Revenue" objective card with 0%
```

### Step 5: User clicks "+ Add Key Result"
```
37. onClick fires in ObjectivesList
38. onAddKeyResult(objective) called
39. Jumps to Home.tsx → handleAddKeyResult()
40. State: setKeyResultObjectiveId(1)
41. State: setIsKeyResultModalOpen(true)
42. Modal opens with KeyResultForm
43. Form shows 4 empty inputs
```

### Step 6: User fills in key result details
```
44. Description: "Close 10 deals"
45. Progress: 0
46. Target: 10
47. Metric: "deals"
48. (Each onChange updates local form state)
```

### Step 7: User clicks "Save"
```
49. handleSave fires in KeyResultForm
50. Validation passes
51. State: setIsSubmitting(true)
52. API call: POST /objectives/1/key-results
    Body: {
      description: "Close 10 deals",
      progress: 0,
      target: 10,
      metric: "deals"
    }
53. Backend creates key result with id: 1
54. Response: { id: 1, description: "...", progress: 0, ... }
55. State: setIsSubmitting(false)
56. onSuccess() callback fires
57. Jumps to Home.tsx → handleKeyResultSuccess()
58. fetchObjectives() called
59. API call: GET /objectives
60. Response: [{
      id: 1,
      title: "Increase Revenue",
      keyResults: [{
        id: 1,
        description: "Close 10 deals",
        progress: 0,
        target: 10,
        metric: "deals"
      }]
    }]
61. State: setObjectives([...])
62. handleCloseKeyResultModal() called
63. State: setIsKeyResultModalOpen(false), setKeyResultObjectiveId(null)
64. Modal disappears
65. ObjectivesList re-renders
66. Shows: "Close 10 deals" with 0/10 deals (0%)
67. Objective overall progress: 0%
```

### Step 8: User updates progress to 7
```
68. User types "7" in progress input
69. onChange fires in ObjectivesList
70. handleUpdateKeyResultProgress(1, 1, 7) called
71. State: setUpdatingKeyResult("1-1")
72. Shows "Updating..." indicator
73. API call: PATCH /objectives/1/key-results/1
    Body: { progress: 7 }
74. Backend updates key result
75. Response: 200 OK
76. onRefresh() callback fires
77. fetchObjectives() called
78. API call: GET /objectives
79. Response: [{ ..., keyResults: [{ ..., progress: 7, ... }] }]
80. State: setObjectives([...])
81. State: setUpdatingKeyResult(null)
82. ObjectivesList re-renders
83. Progress bar shows: 7/10 deals (70%)
84. Objective overall progress: 70%
85. Visual updates: progress bar fills to 70%
```

---

## 🔑 Key Concepts

### 1. **Unidirectional Data Flow**
Data flows DOWN (from Home to children via props)
Actions flow UP (from children to Home via callbacks)

### 2. **Single Source of Truth**
`objectives` array in Home.tsx is the ONLY source of truth.
Children never modify data directly - they call callbacks.

### 3. **Optimistic vs Pessimistic Updates**
**Current approach: Pessimistic**
- Update backend first
- On success, fetch fresh data
- UI updates with confirmed data

**Alternative (Optimistic):**
- Update UI immediately
- Call backend in background
- Rollback if backend fails

### 4. **Modal Pattern**
```
Home manages:
  • Modal visibility (isOpen state)
  • Modal data (editingObjective, objectiveId)
  
Modal content manages:
  • Form state (inputs)
  • Form validation
  • API calls
  • Calls parent on success/close
```

### 5. **Callback Pattern**
```
Parent (Home.tsx):
  ↓ passes down callbacks
Child (ObjectivesList):
  ↑ calls callbacks when events happen
Parent (Home.tsx):
  • Handles the callback
  • Updates state
  • Triggers re-render
  ↓ passes updated props
Child (ObjectivesList):
  • Re-renders with new data
```

---

## 🎯 Summary

**Data Flow:**
1. Home.tsx fetches data from API
2. Data stored in `objectives` state
3. Data passed down to ObjectivesList
4. User interactions trigger callbacks
5. Callbacks execute in Home.tsx
6. State updates in Home.tsx
7. Components re-render with new data

**State Management:**
- **Global state:** In Home.tsx (objectives, modal states)
- **Local state:** In forms (input values, errors, loading)
- **No external state management needed** (Redux, Zustand, etc.)

**Progress Calculation:**
- Key Result: `(current / target) * 100` (capped at 100%)
- Objective: Average of all key results' progress

**Why this works:**
✅ Simple to understand
✅ Easy to debug (trace callbacks)
✅ No prop drilling hell (only 2 levels deep)
✅ Single source of truth
✅ React way of doing things