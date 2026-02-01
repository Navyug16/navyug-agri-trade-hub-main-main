# Navyug Agri Trade Hub

**Live URL**: [https://navyug-enterprise.vercel.app/](https://navyug-enterprise.vercel.app/)

## Project Overview

Navyug Agri Trade Hub is a modern, premium web application built for trading agricultural commodities like groundnut oil, cotton, and spices. It features a responsive design, a dynamic admin dashboard for managing products and inquiries, and a seamless contact system.

## Key Features

-   **Modern Design**: Built with React, Tailwind CSS, and Shadcn UI for a premium, responsive user experience.
-   **Admin Dashboard**: comprehensive admin panel to manage:
    -   **Products**: Add, edit, reorder, and delete products with image uploads (stored in Firestore).
    -   **Inquiries**: Track leads via a Kanban-style pipeline (Pending, In Progress, Won, Lost).
    -   **Analytics**: View sales trends and product interest statistics.
-   **Dynamic Product Catalog**: Customers can browse products with detailed descriptions, specifications, and images.
-   **Contact & Inquiry System**: Integrated contact forms that send email notifications (via EmailJS) and save data to Firestore.
-   **Firebase Integration**:
    -   **Authentication**: Secure admin login.
    -   **Firestore Database**: Real-time accessible database for products and inquiries.

## Technology Stack

-   **Frontend**: React (Vite), TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Backend / Database**: Firebase (Firestore, Auth)
-   **Deployment**: Vercel

## Getting Started Locally

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd navyug-agri-trade-hub-main
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    -   Configure your Firebase credentials in `src/lib/firebase.ts`.
    -   Ensure EmailJS keys are set up in `ContactForm.tsx` (or move them to `.env`).

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Building for Production

To create a production build:

```bash
npm run build
```

## Admin Access

The admin panel is accessible at `/admin`. Access is restricted to authorized email addresses configured in `src/contexts/AdminAuthContext.tsx`.

---

© 2025 Navyug Enterprise. All rights reserved.
