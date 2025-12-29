# SomniaMind - A Dream Visualization & Analysis Platform

## 🚀 Overview

SomniaMind is an innovative platform designed to help users capture, analyze, and visualize their dreams. By leveraging AI and data visualization, it enables users to gain deeper insights into their subconscious thoughts and mental health.

Additionally, the platform groups similar dreams together through unsupervised clustering to reveal deeper patterns and trends over time.

## 🎯 Problem Statement

- Many people are curious about the meaning of their dreams but lack the tools to capture and analyze them.
- Dreams can offer valuable insights into mental well-being; however, most people record their dreams informally or not at all.
- Without proper analysis, recurring themes or patterns in dreams remain hidden.

## 🛠️ Tech Stack

### **Frontend**

- **React.js** with **Tailwind CSS** for a responsive, interactive UI.
- Charting libraries (e.g., **Chart.js**, **Recharts**) for visualizations.

### **Backend**

- **Node.js** with **Express.js** for building robust API endpoints.
- **MongoDB** for storing user data, dream logs, and analysis results.

### **AI & Data Processing**

- **Google Gemini API** for advanced AI-based dream interpretation and structured JSON responses.
- **Stable Diffusion** for generating dream visualization images.
- **Hugging Face & Sentence Transformers** for generating embeddings and assisting in clustering.
- **scikit-learn** (DBSCAN/HDBSCAN/KMeans) for unsupervised clustering.
- **Additional libraries**: Pandas, NumPy for data handling and visualization preparation.

---

## 🌟 Core Features

### **User Management**

- Secure user registration, authentication, and profile customization.

### **Dream Input Options**

- **Basic Input:** Title, description, date.
- **Advanced Input:** Additional details such as location, user interpretation, external influences, sleep quality, dream intensity, characters present, symbols, and mood after waking.

### **Dream Analytics & Visualization**

- **AI-Powered Analysis:**
  - Generates structured analysis including interpretation, keywords, sentiment score, emotional tone distribution, and dream type classification.
  - Produces a prompt for generating a visual representation (via Stable Diffusion).
- **Individual Dream Visualizations:**
  - Radar charts, bar charts, and word clouds for in-depth analysis.
- **Grouped Dream Analytics:**
  - Automated clustering (with options for manual adjustments) to group similar dreams.
  - Visualizations (PCA/t-SNE scatter plots, histograms, multi-line/area charts) to reveal trends over time.
- **Aggregated Analytics:**
  - Timeline/line charts to track overall dream frequency and sentiment.
  - Histograms for distribution of dream intensity and sentiment across all dreams.

### **Community Engagement**

- Share dreams publicly, comment, and interact with others.
- Bookmark and tag dreams for easier retrieval and discussion.

---

## 🔥 Advanced Features (Future Scope)

- **Gamification & Leaderboard**
  - Earn points for activities (e.g., logging dreams, engaging with posts).
  - Leaderboards to foster a community of active dreamers.
- **Clustering & Pattern Tracking:**
  - Advanced unsupervised clustering to group similar dreams.
  - Automated grouping via AI or traditional clustering algorithms, with user override options.
- **Enhanced Dream Visualizations:**
  - Generate more personalized dream images using user-provided photos (faces, surroundings).
- **Dream Timeline:**
  - Visualize dreams over time in a “memory lane” view.
- **Tags and Badges:**
  - Earn badges like “Frequent Dreamer” or “Nightmare Navigator.”
- **Enhanced Community Features:**
  - More robust tagging, search, and filtering options.
- **Deep Analytics:**
  - Compare self-assessed dream intensity vs. AI-calculated intensity.
  - Emotional tone and sentiment trend analysis across time periods.

---

## 📅 Capstone Journey: Day-by-Day Plan

### **Week 1: Project Kickoff & Planning**

- Finalize project idea and scope.
- Define basic vs. advanced input requirements.

- Create wireframes and mockups for both basic and advanced input interfaces.

- Finalize UI/UX design and plan the overall user flow.

### **Week 2: Frontend & Backend Setup**

- Set up the React project with Tailwind CSS.
- Implement static pages and basic navigation.
- Develop basic forms for dream entry (both basic and advanced).
- Set up Node.js/Express backend and configure MongoDB.
- Define MongoDB schemas for users and dreams.
- Implement API endpoints for user management and dream CRUD operations.

### **Week 3: AI Integration & Dream Analysis**

- Integrate AI API for dream interpretation.
- Test AI integration and ensure reliable JSON output.
- Develop a prototype for generating a visual dream image prompt.
- Refine and test the overall dream analysis pipeline.

### **Week 4: Clustering & Visualization**

- Research and experiment with clustering techniques (DBSCAN/HDBSCAN/KMeans, or AI prompting).
- Test clustering with sample data and iterate on parameters.

### **Week 5: Community & Gamification Features**

- Implement public dream posting and commenting system.
- Develop features for tagging and categorizing dreams.
- Test community features and gather initial user feedback.
- Refine UI based on community interaction.

### **Week 6: Advanced Analytics & User Dashboard**

- Build dashboards for individual dream analytics (e.g., radar charts, word clouds).
- Allow users to filter and view analytics by date range (e.g., past week/month).

### **Week 7: Testing, Optimization & Documentation**

- Conduct thorough testing of all features.
- Optimize performance (frontend and backend).
- Write unit tests and integration tests.
- Finalize project documentation and update README.

### **Week 8: Deployment & Feedback**

- Set up Docker and CI/CD pipelines.
- Deploy the application to a cloud service.
- Monitor application performance and fix any deployment issues.
- Final project presentation and capstone submission.

---

## Conclusion

SomniaMind is designed to bridge the gap between subjective dream experiences and actionable insights, making it easier for users to understand and reflect on their subconscious. By combining basic/advanced input options, robust AI analysis, and interactive visualizations, the platform offers both casual users and power users a unique window into the world of dreams. The capstone journey is carefully planned to build the project step-by-step, ensuring a well-rounded and robust final product.

---

### Application Deployment Link:

https://somniamind.fly.dev
