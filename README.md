AI-Powered Smart Email Assistant

An intelligent, multi-interface ecosystem designed to automate context-aware email replies using Generative AI. This repository contains a production-ready ecosystem consisting of a high-performance **Spring Boot REST API**, a standalone **React Explorer Web Application**, and a fully native **Chrome Extension** that seamlessly injects AI capabilities directly into the Gmail user interface.

---

## 🚀 Architectural Overview

The ecosystem operates via a decentralized structure where multiple frontends interact with a core Java backend:

1. **The Core Engine (Spring Boot Backend):** Processes original email fragments, structures contextual behavioral guidelines (prompts), handles secure environment variables, maps upstream JSON hierarchies, and contacts the Google Gemini AI infrastructure asynchronously.
2. **Gmail Injector (Chrome Extension):** A lightweight JavaScript plugin that uses an advanced DOM mutation observer to dynamically track the arrival of compose or reply frames on `mail.google.com` and embed a custom functional trigger button.
3. **Stand-Alone Explorer (React UI):** A responsive interface built with Material-UI (MUI v5) and Axios allowing users to paste plain text raw emails, manually assign response tones, and extract copy-ready drafts.

---

## 🛠️ Tech Stack & Prerequisites

### Backend Core
* **Java 24** (or Java 17+)
* **Spring Boot 3.x**
* **Spring Reactive WebFlux** (`WebClient` for non-blocking stream interaction)
* **Lombok** (Boilerplate code reduction via processing annotations)
* **Jackson `ObjectMapper`** (Manual navigation of deeply nested upstream JSON trees)

### Frontends
* **React.js** (Scaffolded using Vite for hyper-fast compilation and HMR)
* **Material-UI (MUI v5)** (Google-standard component layouts and custom forms)
* **Axios** (Promise-based HTTP client for routing backend exchanges)
* **Vanilla JavaScript / DOM API** (Native browser interaction for Extension frames)

---

## 📂 Core Project Layout

```text
├── email-writer-backend/     # Spring Boot application handles AI pipelines
├── email-writer-frontend/    # React app for manual draft management
└── email-writer-extension/   # Chrome Extension directory for native Gmail injection
    ├── manifest.json         # Extension metadata, permissions, & content scope
    ├── content.js            # Mutation Observers & programmatic DOM injection logic
    └── content.css           # Styling layout rules for custom injected nodes
🛡️ API Specification & Integration
Endpoints
POST http://localhost:8080/api/email/generate

Request Payload (Content-Type: application/json)
JSON
{
  "emailContent": "Thank you for reaching out to us and it was great meeting you at Google I/O yesterday!",
  "tone": "friendly"
}
Response Stream (200 OK)
Plaintext
"Hi [Name],\n\nIt was absolutely wonderful meeting you at Google I/O yesterday as well! I really enjoyed our conversation..."
⚙️ Configuration & Local Installation
1. Core Service Engine Setup
Navigate to your backend directory and open src/main/resources/application.properties. Ensure your profile is wired to accept environmental abstraction markers:

Properties
gemini.api.url=[https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent](https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent)
gemini.api.key=${GEMINI_API_KEY}
Set your secret environment variable locally:

Bash
# Unix/macOS systems
export GEMINI_API_KEY="your_actual_google_ai_studio_secret_key"

# Windows (PowerShell)
$env:GEMINI_API_KEY="your_actual_google_ai_studio_secret_key"
Run the application via Maven or your IDE:

Bash
mvn spring-boot:run
2. Standalone React UI Setup
Navigate to the web UI project directory and trigger package initialization:

Bash
cd email-writer-frontend
npm install
npm run dev
3. Chrome Extension Deployment
Fire up Google Chrome and enter chrome://extensions/ into the URL bar.

Toggle the Developer Mode slider switch in the top right corner to ON.

Select the Load unpacked action block in the top left.

Highlight and select the email-writer-extension/ path location containing your manifest.json.

Open your Gmail interface, click any incoming message, and choose Reply to verify your embedded tracking button is functioning.

🧠 Key Code Implementation Highlights
Reactive Asynchronous Handshakes
The backend implements a decoupled constructor mapping via Spring's WebClient, routing traffic securely without blocking server threads:

Java
this.webClient = webClientBuilder
    .baseUrl(baseUrl)
    .defaultHeader("Content-Type", "application/json")
    .defaultHeader("x-goog-api-key", apiKey)
    .build();
Dynamic DOM Extraction & Mutation Observers
To avoid polling or breaking Gmail's interface, the extension uses native MutationObserver routines to listen for document changes on mail.google.com:

JavaScript
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.M9') || node.querySelector('.M9'))
        );
        if (hasComposeElements) {
            setTimeout(injectAIButton, 500); // Allow thread safety buffering
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });
💎 Custom Engineering Features
CORS Safe Routing: Built-in systemic cross-origin security filter filters (@CrossOrigin(origins = "*")) prevent cross-site blockades from modern web scrapers.

Smart Extension Cleanup: Script lifecycle loops query for active .ai-reply-button identifiers before injection to prevent duplicating buttons across long-lived chat views.

Native Context Selection: Fallback mapping variables dynamically read user selection attributes inside custom lists (professional, casual, friendly) to fine-tune writing guidelines before they reach the LLM pipeline.
