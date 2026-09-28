# Blueprint

### AI-Powered Product Architecture & UI Workspace

Blueprint transforms natural-language product ideas into **editable system architecture diagrams and UI wireframes**.

Instead of starting with a blank canvas, describe what you want to build and let AI turn the idea into a structured visual blueprint that you can inspect, modify, and convert into interface designs.

## 🚀 Live Demo

https://blueprint-pied.vercel.app/

## ✨ What It Does

### 1. Generate Architecture from Product Ideas

Describe an application in natural language.

Blueprint generates a structured architecture containing:

- Users
- Applications
- Features
- Services
- Databases
- External systems
- Relationships between components

The generated architecture is rendered as an interactive graph.

<img width="1919" height="949" alt="{CBEA6356-880C-4017-8866-C428E2B749F2}" src="https://github.com/user-attachments/assets/929362eb-8b08-4fd4-a576-372a659c6ee9" />
<img width="322" height="347" alt="{FD020EDC-3BB6-44A3-98CE-234E500F93BE}" src="https://github.com/user-attachments/assets/45fb5363-9cd6-4b09-a13c-226a824af782" />


### 2. Edit & Explore the Architecture

Architecture nodes are interactive and can be:

- Dragged
- Selected
- Inspected
- Deleted
- Connected through relationships

The architecture can also be exported as JSON.

### 3. Modify Architecture with AI

Existing architecture can be passed back to the AI with a natural-language instruction.

For example:

> Add Google authentication and role-based admin access.

Blueprint updates the existing architecture instead of starting from scratch.

### 4. Generate UI from Architecture

Select an architecture feature and generate a corresponding UI wireframe.

The AI converts the selected feature into structured UI elements that are rendered on an editable visual canvas.

<img width="1897" height="943" alt="{64F05186-B133-400F-A3A3-A476565E9504}" src="https://github.com/user-attachments/assets/6f721216-c5bd-4bbe-805b-cab48aa04adb" />


### 5. Direct AI Wireframing

Blueprint also supports generating a wireframe directly from a UI description.

Example:

> Create a modern Indian fintech dashboard with UPI transactions, account balance, spending analytics and recent transactions.

The generated UI uses Indian conventions such as:

- INR (₹)
- Indian number formatting
- UPI
- Indian names
- DD/MM/YYYY dates

---

## 🧠 Architecture

```text
                    Product Idea
                         │
                         ▼
               ┌──────────────────┐
               │ Requirement      │
               │ Parser           │
               └────────┬─────────┘
                        │
                        ▼
               Structured JSON
                        │
                        ▼
               ┌──────────────────┐
               │ Architecture     │
               │ Graph Renderer    │
               └────────┬─────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        Modify with AI       Select Feature
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ UI Generator    │
                         └────────┬────────┘
                                  │
                                  ▼
                         Structured UI JSON
                                  │
                                  ▼
                         Editable Wireframe
```

## 🛠 Tech Stack
Next.js 16
React
TypeScript
Tailwind CSS
React Flow
Dagre
Lucide React
OpenAI API
Vercel

## 📁 Project Structure
```text
blueprint/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   └── wireframe/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── components/
│       ├── canvas/
│       │   └── ArchitectureNode.tsx
│       │
│       └── wireframe/
│           ├── WireframeCanvas.tsx
│           └── WireframeElement.tsx
│
├── public/
├── package.json
└── README.md
```
## ⚙️ Getting Started
1. Clone the repository
git clone https://github.com/SanaSharma08/blueprint.git
cd blueprint
2. Install dependencies
npm install
3. Configure environment variables

## Create a .env.local file in the project root:

OPENAI_API_KEY=your_api_key_here

4. Run the development server
npm run dev
Open:
http://localhost:3000
5. Build for production
npm run build
## 🔐 Environment Variables
Variable	Description
OPENAI_API_KEY	API key used by the server-side AI generation routes

##🎯 Product Vision
Blueprint explores a more visual approach to early-stage software planning:
Idea → Architecture → Feature → UI
The goal is to reduce the gap between product thinking, system design, and interface design by giving developers and product teams a shared visual workspace.

## 🔮 Future Possibilities
Architecture-to-code generation
More advanced UI components
Responsive device presets
Image/export generation
Persistent projects
Real-time collaboration
Authentication
Design system support

## 👩‍💻 Author

Sana Sharma
B.Tech Computer Science Engineering
Full-Stack Developer & Research Enthusiast
