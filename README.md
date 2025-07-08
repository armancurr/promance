# Prompt Optimizer

A Next.js client-side web application that analyzes and enhances AI prompts in real-time. The app detects vague prompts, provides detailed analysis with scoring, and uses AI to enhance prompts based on predefined quality criteria.

## Features

- **Real-time Prompt Analysis**: Automatically analyzes prompts for clarity, specificity, structure, and completeness
- **Vague Prompt Detection**: Identifies generic or unclear prompts that need improvement
- **AI-Powered Enhancement**: Uses Google's Gemini AI to transform vague prompts into detailed, actionable specifications
- **Monaco Editor Integration**: Side-by-side markdown editor for enhanced prompts with syntax highlighting
- **Security**: Input sanitization and rate limiting to prevent abuse
- **Modern UI**: Clean, responsive interface built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **State Management**: Zustand
- **Editor**: Monaco Editor with markdown support
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS with shadcn/ui components
- **Security**: DOMPurify for input sanitization
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Google Gemini API key (free at [Google AI Studio](https://ai.google.dev/))

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd prompt-optimizer
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   bun install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   bun run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Key Setup

1. Get your free API key from [Google AI Studio](https://ai.google.dev/)
2. In the application, click the "API Key" button in the top-right corner
3. Enter your API key and save it (stored locally in your browser)

## How to Use

### Basic Workflow

1. **Enter a Prompt**: Type your AI prompt in the main text area
2. **View Analysis**: Real-time analysis appears below with scores for:
   - Clarity (1-10)
   - Specificity (1-10)
   - Structure (1-10)
   - Completeness (1-10)
3. **Get Suggestions**: See missing elements and improvement suggestions
4. **Enhance with AI**: Click "Enhance with AI" to get an improved version
5. **Edit in Monaco**: Enhanced prompt opens in a side-panel editor
6. **Export**: Copy or download the enhanced prompt

### Analysis Criteria

**Clarity** - Measures how clear and unambiguous the language is

- Positive: specific terms, clear instructions
- Negative: vague words like "something", "kind of"

**Specificity** - Evaluates concrete details and technical precision

- Positive: technical terms, specific requirements, numbers
- Negative: generic adjectives, undefined concepts

**Structure** - Assesses organization and formatting

- Positive: sections, bullet points, clear hierarchy
- Negative: wall of text, no organization

**Completeness** - Checks for essential prompt elements

- Context and background
- Clear objectives
- Constraints and requirements
- Output format specifications
- Target audience definition

### Example Transformation

**Before (Vague)**:
\`\`\`
Create a landing page for my startup
\`\`\`

**After (Enhanced)**:
\`\`\`markdown

# Landing Page Development Brief

## Context

Create a modern, conversion-focused landing page for a B2B SaaS startup in the project management space.

## Objective

Design and develop a landing page that effectively communicates our value proposition and converts visitors into trial signups.

## Requirements

- Responsive design (mobile-first approach)
- Loading time under 3 seconds
- A/B testing ready structure
- Integration with analytics tools
- SEO optimized

## Target Audience

- Project managers at mid-size companies (50-500 employees)
- Tech-savvy professionals aged 28-45
- Users familiar with digital tools and SaaS products

## Output Format

- HTML/CSS/JavaScript implementation
- Figma design files
- Performance optimization report
- SEO checklist completion

## Success Criteria

- > 15% visitor-to-trial conversion rate
- > 90 PageSpeed Insights score
- <3 second load time
  \`\`\`

## Security Features

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Rate Limiting**: API calls are rate-limited to prevent abuse (10 requests per minute)
- **Local Storage**: API keys are stored locally, never sent to our servers
- **Content Validation**: File uploads and content are validated for safety

## Development

### Project Structure

\`\`\`
src/
├── app/ # Next.js app router
├── components/  
│ ├── ui/ # shadcn/ui components
│ ├── prompt-input.tsx # Main input area
│ ├── analysis-panel.tsx # Analysis display
│ ├── side-panel.tsx # Monaco editor
│ └── enhancement-button.tsx
├── lib/ # Core logic
│ ├── prompt-analyzer.ts # Analysis algorithm
│ ├── ai-enhancer.ts # AI integration
│ ├── sanitizer.ts # Security utilities
│ └── rate-limiter.ts # Rate limiting
stores/ # Zustand state management
hooks/ # Custom React hooks
types/ # TypeScript definitions
\`\`\`

### Building

\`\`\`bash
bun run build
\`\`\`

### Type Checking

\`\`\`bash
bunx tsc --noEmit
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- Create an issue on GitHub
- Check the documentation
- Review the TypeScript types for API reference

---

Built with ❤️ using Next.js, React, and Google Gemini AI
