
# 🎉 Welcome to **StoreIt** 📂

## 🌟 About The Project

Welcome to **StoreIt** - an intuitive, cloud-based storage solution for all your documents, multimedia files, and more. This platform allows users to upload and organize a variety of file types such as **images**, **videos**, **audios**, **PDFs**, **PowerPoint presentations (PPT)**, **Word documents**, and **CSV files**. 

With automatic categorization and RAG (Red, Amber, Green) for PDF files, organizing your digital assets has never been easier!

---

## 🚀 Key Features

- **File Upload**: Seamlessly upload files like **image**, **video**, **audio**, **PDF**, **Word**, **PowerPoint**, **CSV**, and more!
- **Auto Categorization**: All uploaded files are automatically categorized into dedicated sections based on their type.
- **File Storage**: Each file type gets stored in its respective section for easy access and organization.
- **RAG for PDFs**: Implemented RAG (Red, Amber, Green) system for each **PDF** to easily view the document's status.
- **User Authentication**: Sign up and log in to manage your files securely.
- **Intuitive Dashboard**: An easy-to-use dashboard to manage all your uploaded documents and files.
- **Dropdown Menu & Dialog Boxes**: Easy navigation with dropdowns for file management and dialog boxes for efficient interactions.

---

## 🎬 Screenshots

Here's a glimpse of what you’ll experience:

### 1. **Sign In Page**
![Sign In](/public//images/sighin.png)

### 2. **Sign Up Page**
![Sign Up](/public//images/signup.png)

### 3. **OTP**
![Sign Up](/public//images/otp.png)

### 4. **User Dashboard**
![Dashboard](/public//images/dashboard.png)

### 4.1. **Dropdown Menu**
![Dropdown](/public//images/dropdown.png)

### 5. **Dialog Box for File Upload**
![Dialog Box](/public//images/uploading.png)

### 6. **PDF Section**
![PDF Section](/public//images/pdfsection.png)

### 7. **Word Section**
![Word Section](/public//images/doc.png)

### 8. **PDF View**
![PPT Section](/public//images/view.png)

### 9. **PDF View with RAG Indicator**
![PDF View](/public//images/typing.png)

### 10. **RAG View for PDF**
![RAG View](/public//images/output.png)

---

## ⚙️ Tech Stack

This application is built using modern and powerful technologies:

- **Frontend**:
  - **Next.js**: A React framework for server-side rendering and static websites.
  - **Tailwind CSS**: A utility-first CSS framework to rapidly build custom designs.
  
- **AI**:
  - **Gemini AI**: Integrated for advanced features such as document analysis and RAG (Red, Amber, Green) classification for PDFs.
  
- **Backend**:
  - **AppWriter**: Handles file management and storage, ensuring a smooth and fast user experience.

---

## 💻 Getting Started

To get started with **StoreIt**, follow these steps:

### 1. Clone this repository

```bash
git clone https://github.com/sidhyaashu/iit_kgp.git
cd iit_kgp
```

### 2. Install Dependencies

```bash
npm install
```


# 🌟 Set Up Your Environment Variables in `.env.local`

Before you can run the app, you need to configure your environment variables. Create a `.env.local` file in the root directory of your project and add the following values:

```bash
# Appwrite Configuration 📝

NEXT_PUBLIC_APPWRITE_PROJECT = <your_project_id> # Project ID for your Appwrite project
NEXT_PUBLIC_APPWRITE_DATABASE = <your_database_name> # The database name in Appwrite
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION = <your_users_collection> # The collection for user data
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION = <your_files_collection> # The collection where files will be stored
NEXT_PUBLIC_APPWRITE_BUCKET = <your_bucket_name> # Bucket name for storing files

# Appwrite API Key 🔑

NEXT_APPWRITE_KEY = <your_appwrite_api_key> # The secret API key for Appwrite (keep this private)

# Appwrite Endpoint 🌍
NEXT_PUBLIC_APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1" # The endpoint for Appwrite (this is the default)

# Gemini AI API Key 🤖
NEXT_PUBLIC_GEMINI_API_KEY = <your_gemini_api_key> # The API key for Gemini AI (for RAG and document analysis)
```

### 3. Run the Development Server

```bash
npm run dev
```

Now, open your browser and visit `http://localhost:3000` to see your app in action! 🚀

---

## 🛠️ Features Under Development

- Enhanced RAG integration with AI-based document analysis 📊
---

## 📬 Contact & Support

For any queries, feel free to reach out to us:

- Email: [your-email@example.com](mailto:ashutoshsidhya69@example.com)
- GitHub: [your-username](https://github.com/sidhyaashu)

---

## 🎨 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💖 Acknowledgments

- Special thanks to the **Next.js** team for the awesome framework! 🙌
- Huge thanks to the **Tailwind CSS** community for the fantastic design tools! 🎨
- Thanks to **Gemini AI** for providing the AI functionalities that made our RAG features possible! 🤖

---

**Enjoy using StoreIt, your next-gen document storage solution!** 🎉

---

```bash
npm install --save-dev eslint-config-standard eslint-plugin-tailwindcss eslint-config-prettier prettier --legacy-peer-deps
npm i node-appwrite --legacy-peer-deps
```
