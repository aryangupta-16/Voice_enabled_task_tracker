# Quick Setup & Running Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd /Users/aryan/projects/Aerchain_task/task_management_frontend/my-app
npm install
```

### Step 2: Configure Environment
The `.env.local` is already created with:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

If you need to change it:
```bash
# Edit .env.local and update the URL if backend is on different port
nano .env.local
```

### Step 3: Start Backend (in separate terminal)
Make sure your Node.js backend is running:
```bash
# Navigate to backend folder and run
npm run dev
# or
node src/index.ts
```

Backend should be running on `http://localhost:3000`

### Step 4: Start Frontend (Development Mode)
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

> **Note**: If frontend and backend are both on port 3000, change frontend in `package.json`:
> ```bash
> npm run dev -- -p 3001
> ```

## 📋 Project Files Created

### Type Definitions
- `src/types/index.ts` - All TypeScript types and interfaces

### Services (API & Voice)
- `src/services/api.ts` - API client with all endpoints
- `src/services/voiceRecognition.ts` - Web Speech API wrapper
- `src/services/index.ts` - Service exports

### Hooks
- `src/hooks/useTasks.ts` - Task state management
- `src/hooks/useVoice.ts` - Voice input management
- `src/hooks/index.ts` - Hook exports

### Components

**Common (`src/components/common/`)**
- `Modal.tsx` - Dialog component
- `Button.tsx` - Button variants
- `Alert.tsx` - Alert notifications
- `index.ts` - Exports

**Task (`src/components/task/`)**
- `TaskCard.tsx` - Individual task display
- `TaskForm.tsx` - Create/edit form
- `TaskFilter.tsx` - Filter controls
- `index.ts` - Exports

**Voice (`src/components/voice/`)**
- `VoiceInputButton.tsx` - Record button
- `VoiceParseReview.tsx` - Review modal
- `index.ts` - Exports

### Pages
- `src/pages/HomePage.tsx` - Main application page

### Utilities
- `src/utils/helpers.ts` - Helper functions

### Configuration
- `app/page.tsx` - Updated root page
- `app/layout.tsx` - Updated metadata
- `app/globals.css` - Enhanced styles
- `tsconfig.json` - Updated path aliases
- `.env.example` - Example environment variables
- `.env.local` - Local configuration (created)

### Documentation
- `FRONTEND_README.md` - Complete frontend documentation
- `DEVELOPMENT_GUIDE.md` - Architecture and development guide
- `SETUP_GUIDE.md` - This file

## 🎯 Key Features Implemented

✅ **Voice Input**
- Start/stop recording button
- Real-time transcript display
- Web Speech API integration

✅ **Voice Parsing Review**
- Show parsed task details
- Edit fields before saving
- Display confidence scores
- Show raw transcript

✅ **Task Management**
- Create tasks (manual & voice)
- View tasks (board & list)
- Edit tasks
- Delete tasks with confirmation
- Status tracking

✅ **Filtering & Search**
- Filter by status
- Filter by priority
- Search by title/description
- Reset filters

✅ **UI/UX**
- Kanban board view
- List view
- Modal dialogs
- Alert notifications
- Loading states
- Error handling
- Responsive design

## 🔌 API Integration

All endpoints from `../api-endpoints.md` are integrated:

**Tasks**
- POST /tasks - Create task
- GET /tasks - Get all tasks
- GET /tasks/:id - Get task
- PATCH /tasks/:id - Update task
- DELETE /tasks/:id - Delete task

**Voice**
- POST /voice/parse - Parse transcript
- POST /voice/create-task - Create from voice
- GET /voice/logs/:logId - Get parsing log

**Health**
- GET /health - Health check

## 🎤 Testing Voice Features

### Simple Voice Commands to Try:

1. **"Create a high priority task to review authentication by tomorrow"**
   - Expected: Title "Review authentication", Priority HIGH, Due tomorrow

2. **"Add a low priority task to update documentation by next Monday"**
   - Expected: Title "Update documentation", Priority LOW, Due next Monday

3. **"Urgent: Fix critical bug in payment module"**
   - Expected: Title "Fix critical bug in payment module", Priority CRITICAL

## 📊 Component Architecture

```
HomePage (Main Container)
├── Header with Voice Button & Add Task
├── Alerts (for errors/success)
├── Task Filters
├── View Toggle (Board/List)
├── Board View / List View
│   └── TaskCard (multiple)
└── Modals
    ├── TaskForm Modal
    └── VoiceParseReview Modal
```

## 🔄 Data Flow Example

**Creating Task Manually:**
```
User fills form → TaskForm → onSubmit 
  → useTasks.createTask() 
  → taskService.createTask() 
  → API POST /tasks 
  → Update local state 
  → Close modal 
  → Show success alert
```

**Creating Task from Voice:**
```
Click Record → Web Speech API 
  → Transcript in real-time 
  → Auto-stop on silence 
  → Parse Transcript 
  → Show Review Modal 
  → User reviews/edits 
  → Create Task from Voice 
  → Save to backend 
  → Update UI
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /api/v1..."
**Solution**: Backend not running or URL is wrong
```bash
# Check backend is running on port 3000
curl http://localhost:3000/api/v1/health
```

### Issue: "Speech Recognition not supported"
**Solution**: Browser doesn't support Web Speech API
- Use Chrome, Edge, or Safari instead
- Check browser compatibility

### Issue: TypeScript errors after file changes
**Solution**: Rebuild project
```bash
rm -rf .next
npm run build
```

### Issue: Port 3000 already in use
**Solution**: Change frontend port
```bash
npm run dev -- -p 3001
```

## 📚 File Navigation

Starting from project root:
```
my-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # ← Home page (points to HomePage)
│   ├── layout.tsx         # ← Root layout
│   └── globals.css        # ← Global styles
├── src/                    # ← Source code
│   ├── components/        # ← React components
│   ├── hooks/            # ← Custom hooks
│   ├── services/         # ← API & external services
│   ├── types/            # ← TypeScript definitions
│   ├── utils/            # ← Helper functions
│   └── pages/            # ← Page components
├── .env.local            # ← Environment variables (CREATED)
├── tsconfig.json         # ← TypeScript config (UPDATED)
├── package.json          # ← Dependencies
└── README.md             # ← Main documentation
```

## ✅ Verification Steps

After installation, verify everything works:

```bash
# 1. Check TypeScript compilation
npx tsc --noEmit

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000

# 4. Try creating a task manually
# 5. Try creating a task with voice (Chrome recommended)
# 6. Check browser console (F12) for any errors
```

## 🎨 Customization

### Change API URL
Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### Change Tailwind Colors
Edit `tailwind.config.js` (if exists) or use inline Tailwind classes

### Change Voice Language
In `src/services/voiceRecognition.ts`:
```typescript
this.recognition.lang = 'es-ES'; // Spanish
```

## 📖 Learning Path

1. **Start**: Read README.md (overview)
2. **Understand**: Read DEVELOPMENT_GUIDE.md (architecture)
3. **Explore**: Look at HomePage.tsx (main component)
4. **Learn**: Check individual components in src/components/
5. **Master**: Read hooks in src/hooks/
6. **Integrate**: Look at services in src/services/

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Start backend
3. ✅ Start frontend
4. ✅ Test manual task creation
5. ✅ Test voice task creation
6. ✅ Explore board and list views
7. ✅ Test filtering and search

## 📞 Support

If you encounter issues:
1. Check console (F12 in browser)
2. Check browser network tab
3. Verify backend is running
4. Check FRONTEND_README.md for detailed docs
5. Check DEVELOPMENT_GUIDE.md for architecture

---

**Happy coding! 🚀**
