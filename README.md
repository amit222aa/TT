# 🍕 Online Food Ordering System

## Project Overview

A complete full-stack food ordering system built with C++ backend and modern web frontend.

### Key Features
- ✅ User authentication and registration
- ✅ Menu browsing with categories
- ✅ Shopping cart functionality
- ✅ Order tracking system
- ✅ Responsive web interface
- ✅ SQLite database with 5 tables
- ✅ RESTful API endpoints

### Technology Stack
- **Backend:** C++17, SQLite3, CMake
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Images:** Unsplash API
- **Currency:** Indian Rupees (₹)

## 📋 Project Report

📄 **[View Simple Report](SIMPLE_REPORT.html)** - Professional project documentation with screenshots and ER diagram

📊 **[View Detailed Report](PROJECT_REPORT.html)** - Comprehensive project documentation

📝 **[Download Markdown](PROJECT_REPORT.md)** - Project details in Markdown format

## 🚀 Quick Start

### Prerequisites
- C++ compiler (MSVC/GCC)
- CMake 3.10+
- SQLite3 libraries
- Modern web browser

### Build Backend
```bash
cd backend
mkdir build && cd build
cmake ..
cmake --build . --config Release
```

### Run Application
1. Start backend: `./backend/build/bin/Release/food_ordering_system.exe`
2. Open frontend: `frontend/index.html` in browser

## 📁 Project Structure

```
food-ordering-system/
├── backend/                 # C++ backend
│   ├── src/                # Source files
│   ├── include/            # Header files
│   └── CMakeLists.txt      # Build configuration
├── frontend/               # Web frontend
│   ├── index.html         # Main menu page
│   ├── order-tracking.html # Order tracking
│   ├── css/style.css      # Styling
│   └── js/                # JavaScript files
├── .vscode/               # VS Code configuration
├── SIMPLE_REPORT.html     # Simple project report
├── PROJECT_REPORT.html    # Detailed project report
├── er_diagram.svg         # Database ER diagram
├── screenshot_*.svg       # Application screenshots
└── README.md             # This file
```

## 📊 Database Schema

### Tables
- **users** - User accounts and authentication
- **menu_items** - Food menu database
- **cart** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order

### ER Diagram
📈 **[View ER Diagram](er_diagram.svg)**

## 📸 Screenshots

- 🏠 **[Main Menu](screenshot_main_menu.svg)** - Food ordering interface
- 📋 **[Order Tracking](screenshot_order_tracking.svg)** - Order history and status

## 🔧 Development

### VS Code Configuration
All necessary VS Code configuration files are included:
- IntelliSense settings for C++
- Build tasks for CMake
- Debug configurations

### Build Instructions
See the project reports for detailed setup instructions.

## 📞 Support

For questions about the project:
1. Check the project reports
2. Review VS Code configuration
3. Verify all dependencies are installed

---

**Location:** `d:\HTML folder\techt beta\food-ordering-system\`  
**Generated:** April 4, 2026  
**Status:** ✅ Complete