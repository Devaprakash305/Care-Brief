# 🏥 CareBrief AI

### AI-Generated Personalized Discharge Summaries

> Transform complex clinical notes into clear, personalized, patient-friendly discharge instructions — adapted to the patient's language and literacy level, reviewed by a clinician, and delivered directly to the patient's WhatsApp.

---

## 🚀 Overview

**CareBrief AI** is a clinician-focused Generative AI application designed to simplify the creation of personalized patient discharge instructions.

The system converts structured or unstructured clinical notes into:

- Clear
- Patient-friendly
- Personalized
- Language-adapted
- Literacy-level-adapted

discharge instructions.

The most important principle of CareBrief is:

> **AI assists the clinician — the clinician remains in control.**

AI-generated instructions are never sent directly to the patient.

The clinician reviews, edits, and approves the generated content before the final PDF is released to the patient through WhatsApp.

---

# 🎯 Problem Statement

Clinical discharge instructions are often written using complex medical terminology and may not be suitable for the patient's language or literacy level.

This can make it difficult for patients to understand:

- Their condition
- Medications
- Home-care instructions
- Follow-up requirements
- Warning signs
- Recovery instructions

GA-02 focuses on building a generative AI system that converts clinical notes into plain-language, patient-specific discharge instructions in the patient's preferred language and literacy level.

---

# 💡 Proposed Solution

CareBrief uses Generative AI to transform clinical notes into personalized discharge instructions.

### Core workflow

```text
Clinical Notes
      ↓
Patient Information
      ↓
Language Selection
      ↓
Literacy Level Selection
      ↓
AI Generation
      ↓
Clinician Review
      ↓
Clinician Edit
      ↓
Clinician Approval
      ↓
Final PDF
      ↓
Supabase Storage
      ↓
Twilio WhatsApp
      ↓
Patient

The patient does not need to log into CareBrief.

The patient simply receives the final clinician-approved PDF through WhatsApp.

👨‍⚕️ Primary User
Clinician / Doctor

The clinician is the primary user of CareBrief.

The clinician can:

Create a new discharge summary
Enter patient details
Enter the patient's WhatsApp number
Enter or upload clinical notes
Select the patient's preferred language
Select the literacy/readability level
Generate AI discharge instructions
Review the AI-generated draft
Edit the generated content
Approve the final version
Generate the final PDF
Send the approved PDF to the patient's WhatsApp
View delivery status
🧑‍🦱 Patient Experience

The patient is a recipient, not a primary application user.

The patient does NOT require:

A CareBrief account
A CareBrief dashboard
A CareBrief login
A patient-side AI interface

Instead:

Clinician
   ↓
Approve Final Instructions
   ↓
Generate PDF
   ↓
WhatsApp
   ↓
Patient receives PDF

This keeps the application focused on the clinical workflow.

✨ Key Features
1. 📝 New Discharge Summary

Clinicians can create a new discharge summary by entering:

Patient name
Patient ID where applicable
Patient WhatsApp number
Clinical notes
Preferred language
Literacy/readability level
2. 🤖 AI-Powered Discharge Instruction Generation

CareBrief uses Generative AI to convert clinical notes into patient-friendly discharge instructions.

The AI focuses on:

Simplifying medical terminology
Structuring information clearly
Preserving important clinical information
Adapting the output to the patient
Producing easy-to-understand instructions
3. 🌍 Multilingual Support

Clinicians can select the patient's preferred language.

The AI generates discharge instructions in the selected language.

The language preference is passed to the AI generation workflow rather than simply translating the final UI.

4. 📖 Literacy / Readability Adaptation

CareBrief supports different readability levels.

Simple

Designed for patients who need highly accessible instructions.

Short sentences
Common vocabulary
Minimal medical terminology
Clear action-oriented instructions
Standard

Balanced patient-friendly language with moderate detail.

Detailed

Provides more complete explanations while remaining understandable.

5. 🔍 Clinical / Factual Consistency

The generated content is designed to remain aligned with the provided clinical notes.

CareBrief should not invent unsupported:

Diagnoses
Medications
Dosages
Treatments
Appointments
Clinical facts

The AI output is treated as a draft requiring clinician review.

6. 👨‍⚕️ Clinician Review & Editing

AI-generated content is never considered final automatically.

The clinician can:

Read the generated instructions
Edit the content
Correct mistakes
Modify wording
Add information
Remove incorrect information
Regenerate the draft if necessary

The interface clearly identifies the output as:

AI-generated draft — Review required before release

7. ✅ Clinician Approval

The clinician must explicitly approve the final version.

The workflow is:

AI Draft
   ↓
Clinician Review
   ↓
Clinician Edit
   ↓
Approve & Release

Only the approved version can be converted into the final patient document.

8. 📄 Professional PDF Generation

After approval, CareBrief generates a patient-facing PDF.

The PDF contains the clinician-approved discharge instructions.

Possible content includes:

Patient information
Discharge summary
Diagnosis where provided
Treatment information
Medication instructions where provided
Home-care instructions
Diet/lifestyle instructions
Follow-up instructions
Warning signs
Emergency instructions
Additional approved instructions

The PDF is designed to be readable on mobile devices.

9. ☁️ Supabase Storage

The final PDF can be uploaded to Supabase Storage.

Example storage structure:

discharge-pdfs/
    patient-id/
        summary-id-timestamp.pdf

The stored document can then be accessed by the WhatsApp delivery backend.

10. 📱 WhatsApp Delivery

After clinician approval:

Approved Content
      ↓
Final PDF
      ↓
Supabase Storage
      ↓
Twilio WhatsApp
      ↓
Patient

The patient's WhatsApp number comes from the New Summary workflow.

The system does not use hardcoded patient phone numbers.

11. 🔐 Approval-Based WhatsApp Safety

One of the most important rules in CareBrief is:

Never send an unapproved AI-generated draft to the patient.

The backend should verify that the discharge summary has been approved before allowing WhatsApp delivery.

AI Generated
     ↓
NOT SENDABLE
     ↓
Clinician Review
     ↓
Clinician Edit
     ↓
Clinician Approval
     ↓
SENDABLE
     ↓
WhatsApp
12. 📊 Delivery Status

The clinician can see the delivery state.

Possible states include:

Ready to Send
Sending
Sent
Delivery Failed

If delivery fails, the approved PDF remains available and can be sent again.

The clinician does not need to regenerate the AI summary.

13. 🔄 Retry Delivery

If WhatsApp delivery fails:

Approved PDF
      ↓
Delivery Failed
      ↓
Retry
      ↓
WhatsApp

The system reuses the approved PDF.

It does not unnecessarily regenerate the AI content.

🧠 AI Design Principles

CareBrief uses AI as a clinical communication assistant, not as an autonomous diagnostic system.

The AI should:

Transform clinician-provided information
Simplify complex language
Adapt language to the patient
Adapt readability to the selected level
Preserve clinically important information
Avoid unsupported claims
Avoid fabricating clinical information
Produce a draft for clinician review
AI does NOT independently:
Diagnose patients
Prescribe medication
Change medication dosage
Create unsupported treatment plans
Invent appointments
Replace clinician judgment
🔄 Complete User Workflow
┌──────────────────────┐
│      CLINICIAN       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    New Summary       │
│                      │
│ Patient Details      │
│ WhatsApp Number      │
│ Clinical Notes       │
│ Language             │
│ Literacy Level       │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    AI Generation     │
│                      │
│ Clinical Notes →     │
│ Patient-Friendly     │
│ Instructions         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Clinician Review   │
│      & Edit          │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Approve & Release  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    Generate PDF      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Supabase Storage    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Twilio WhatsApp    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│       PATIENT        │
│                      │
│ Receives final PDF   │
│ through WhatsApp     │
└──────────────────────┘
🏗️ System Architecture
                    ┌─────────────────┐
                    │    Clinician    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │                 │
                    │ New Summary     │
                    │ Review / Edit   │
                    │ Approval        │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
        ┌─────────────────┐     ┌─────────────────┐
        │ OpenRouter / AI  │     │    Supabase     │
        │                 │     │                 │
        │ AI Generation   │     │ Database        │
        │ Language        │     │ Authentication  │
        │ Literacy        │     │ Edge Functions  │
        └────────┬────────┘     └────────┬────────┘
                 │                       │
                 └───────────┬───────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Clinician       │
                    │ Review & Edit   │
                    └────────┬────────┘
                             │
                       APPROVE
                             │
                             ▼
                    ┌─────────────────┐
                    │     jsPDF       │
                    │                 │
                    │ Final PDF       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Supabase        │
                    │ Storage         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Twilio WhatsApp │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Patient     │
                    │                 │
                    │ Final PDF       │
                    └─────────────────┘
🛠️ Technology Stack
Layer	Technology
Frontend	React
AI / LLM	OpenRouter
Backend	Supabase
Database	PostgreSQL / Supabase
Authentication	Supabase Auth
Serverless Backend	Supabase Edge Functions
PDF Generation	jsPDF
File Storage	Supabase Storage
WhatsApp	Twilio WhatsApp API
Hosting	Cloudflare Pages
Version Control	Git / GitHub
💻 Frontend

CareBrief uses React for the clinician-facing application.

The frontend provides:

Clinician dashboard
New Summary workflow
Patient information
Clinical notes input
Language selection
Literacy selection
AI generation
Review interface
Editing
Approval
Delivery status

The UI is designed to be:

Responsive
Professional
Minimal
Clinician-focused
Easy to navigate
🧠 AI / LLM

The application uses an LLM through OpenRouter.

The AI receives relevant context such as:

Patient Information
+
Clinical Notes
+
Preferred Language
+
Literacy Level

and produces:

Personalized Discharge Instructions

The generated content is then reviewed by the clinician.

🗄️ Database

Supabase/PostgreSQL is used for application data.

Depending on the existing schema, the system can maintain information such as:

Patients
id
name
phone
preferred_language
created_at
updated_at
Clinical Notes
id
patient_id
content
created_at
created_by
Discharge Instructions
id
patient_id
generated_content
edited_content
approved_content
language
literacy_level
status
approved_at
approved_by
created_at
updated_at
Delivery
id
summary_id
patient_id
recipient
channel
status
sent_at
failure_reason

The actual production schema should always be treated as the source of truth.

📦 PDF Generation

CareBrief uses jsPDF where client-side PDF generation is required.

Example:

import jsPDF from "jspdf";

const doc = new jsPDF();

doc.text("Discharge Instructions", 20, 20);

const pdfBlob = doc.output("blob");

The actual implementation should handle:

Text wrapping
Multiple pages
Patient information
Section headings
Long discharge instructions
Professional formatting
☁️ Supabase Storage

Final PDFs can be stored in a Supabase Storage bucket such as:

discharge-pdfs

Example:

discharge-pdfs/
  patient-id/
    summary-id-timestamp.pdf

The stored file can then be made accessible to the WhatsApp delivery service using the appropriate secure/public URL strategy.

📱 WhatsApp Integration

Twilio WhatsApp is used for the hackathon delivery workflow.

The WhatsApp message contains:

A short message
The final approved discharge PDF

Example:

Your clinician-approved discharge instructions are attached.

The Twilio credentials must remain server-side.

They should be stored as Supabase Edge Function secrets.

Example environment variables:

TWILIO_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_FROM
⚡ Supabase Edge Functions

The WhatsApp integration should run server-side through a Supabase Edge Function.

Example:

supabase/functions/
    send-discharge-whatsapp/
        index.ts

The Edge Function is responsible for:

Validating the request
Checking approval status
Retrieving the patient WhatsApp number
Retrieving the approved PDF
Calling Twilio
Returning the actual API response
Updating delivery status
🔐 Security

CareBrief handles sensitive patient information, so security is an important part of the architecture.

Important practices
API keys are never exposed in frontend code.
Twilio credentials remain server-side.
AI credentials remain server-side.
Supabase service-role keys remain server-side.
Backend operations validate authorization.
Patient information is protected.
Unapproved summaries cannot be sent.
User-generated content is validated/sanitized.
Sensitive information is not unnecessarily exposed in URLs.
🛡️ Clinician-Controlled Safety

CareBrief follows a human-in-the-loop design.

AI does:
Generate Draft
Clinician does:
Review
Edit
Approve
Release
System does:
Generate PDF
Send Approved PDF
Track Delivery

This ensures the final patient-facing document is controlled by the clinician.

📋 Summary Status

A discharge summary can move through states such as:

Draft
  ↓
AI Generated
  ↓
Under Review
  ↓
Edited
  ↓
Approved
  ↓
Released
  ↓
Sent

If WhatsApp delivery fails:

Approved
   ↓
Delivery Failed
   ↓
Retry
🧪 Error Handling

CareBrief provides clear feedback for common failures.

Missing clinical notes
Please enter or upload the clinical notes before generating the discharge instructions.
Missing WhatsApp number
Please enter the patient's WhatsApp number before sending the discharge instructions.
AI failure
We couldn't generate the discharge instructions. Please try again.
PDF failure
The final PDF could not be generated. Please try again.
WhatsApp failure
The discharge instructions were approved, but WhatsApp delivery failed. Please retry delivery.
🔁 Retry Handling

A failed WhatsApp delivery does not invalidate the approved discharge summary.

The system can retry the delivery using the existing:

Approved content
Generated PDF
Patient WhatsApp number

The clinician does not need to regenerate the AI response.

🚀 Installation
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd carebrief
2. Install dependencies
npm install
3. Configure environment variables

Create a .env / .env.local file according to the project's existing environment configuration.

Example:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Server-side secrets should NOT be placed in frontend environment variables.

For Supabase Edge Functions, configure secrets such as:

TWILIO_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_FROM

Never commit secrets to GitHub.

▶️ Run Locally

Start the development server:

npm run dev

Then open the local URL shown by Vite.

🗃️ Supabase Setup

The project uses Supabase for:

Database
Authentication
Storage
Edge Functions

Before running the complete workflow, configure the required:

Database tables
Authentication
Storage bucket
Edge Functions
Environment secrets
📱 Twilio WhatsApp Sandbox

For hackathon demonstration, Twilio WhatsApp Sandbox can be used.

The demo recipient must join the configured WhatsApp Sandbox before receiving messages.

For production deployment, a proper WhatsApp Business configuration should be used.

🧑‍💻 Development Workflow

The recommended implementation workflow is:

1. Inspect existing architecture
        ↓
2. Preserve working functionality
        ↓
3. Implement clinician workflow
        ↓
4. Connect AI generation
        ↓
5. Implement review/edit
        ↓
6. Implement approval
        ↓
7. Generate PDF
        ↓
8. Store PDF
        ↓
9. Send through WhatsApp
        ↓
10. Track delivery
📊 Example Use Case

A clinician has completed treatment for a patient.

The clinician enters:

Clinical Notes:
Patient treated for respiratory infection.
Continue prescribed medication.
Maintain hydration.
Follow up after one week.
Return immediately if breathing difficulty worsens.

The clinician selects:

Language: English
Literacy Level: Simple

CareBrief generates patient-friendly discharge instructions.

The clinician reviews and edits the content.

The clinician clicks:

Approve & Release

CareBrief then:

Approved Instructions
        ↓
PDF
        ↓
Supabase Storage
        ↓
Twilio WhatsApp
        ↓
Patient

The patient receives the final discharge PDF through WhatsApp.

🌍 Future Scope

Future versions of CareBrief can include:

More regional languages
Advanced readability scoring
Medication cross-checking
Voice/audio discharge instructions
Version history
Advanced audit trails
Improved factual consistency checks
Clinical terminology validation
Additional messaging channels
Hospital/EHR integration
Production-grade WhatsApp Business integration
Secure signed document URLs
Advanced clinician analytics
Multi-clinician / hospital workflows
Role-based access control
Patient acknowledgement tracking
📈 Scalability

CareBrief can be extended from a hackathon prototype into a larger clinical communication platform.

Potential future integrations include:

Hospital EHR
      ↓
CareBrief
      ↓
AI Personalization
      ↓
Clinician Review
      ↓
Patient Communication

The architecture can also support additional communication channels such as:

WhatsApp
SMS
Email
Patient portals