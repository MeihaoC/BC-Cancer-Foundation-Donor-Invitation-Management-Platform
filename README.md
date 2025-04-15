# Donor Invitation Management System for BC Cancer Foundation

A full-stack web application designed to help the BC Cancer Foundation manage donor data, organize fundraising events, and generate curated donor invitation lists based on engagement level, donation history, and other filters.

## 🧭 Overview

This platform enables fundraisers and coordinators to:

- Manage events and donors through a user-friendly dashboard
- Apply filters such as medical focus, location, and engagement level to generate donor invitation lists
- Edit or remove donor assignments for specific events
- View and modify event information in real-time

Built with a **React frontend**, **Express.js backend**, and **MySQL** database, this tool supports efficient event and donor management through a responsive UI and RESTful APIs.

## ⚙️ Setup

1. Clone the repository
```bash
git clone https://github.com/MeihaoC/CS5500-BC-Cancer-Foundation.git
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Start the backend server
```bash
npm start
```

4. Install frontend dependencies
```bash
cd client
npm install
```

5. Start the frontend application
```bash
npm start
```

## 🚀 Features

- ✅ Login system for fundraisers and coordinators
- ✅ Create, edit, and delete fundraising events
- ✅ Filter donors by:
  - City
  - Medical Focus
  - Engagement Level
- ✅ Add or remove donors from an event before finalizing the invitation list
- ✅ Generate a list of recommended donors based on filters
- ✅ Dynamic UI updates with API integration

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Other tools**: Docker (optional setup), Postman for testing, GitHub for version control

## 🧪 Testing

- Backend routes tested with Postman
- Frontend functionality tested manually in browser
- Error handling and edge cases covered (e.g., invalid skill levels, empty input)
