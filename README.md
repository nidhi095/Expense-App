#  ExpeApp — React Native + FastAPI + MySQL

A full-stack mobile application for managing **Expenses, Trips, and Reports** with:

- **React Native (Android)**
- **FastAPI Backend**
- **MySQL Database**
- **JWT Authentication**
- Receipt Image Upload + OCR (client-side)

---

# Project Structure

```
ExpeApp/
│
├── backend/        # FastAPI app
│   ├── app/
│   └── venv/
│
└── src/            # React Native App
```

---

# ⚙️ BACKEND SETUP (FASTAPI + MYSQL)

## 1. Create & Activate Virtual Environment

```sh
python -m venv venv
venv\Scripts\activate      # Windows
# OR
source venv/bin/activate   # macOS/Linux
```

---

## 2. Install Python Dependencies

```sh
pip install -r requirements.txt
```

---

##  3. Setup MySQL Database

Create a new database named:

```
expeapp
```

Verify credentials in:

`backend/app/database.py`

```python
MYSQL_USER = "root"
MYSQL_PASSWORD = ""       # your MySQL password
MYSQL_HOST = "127.0.0.1"
MYSQL_DB = "expeapp"
```

---

## 4. Run the FastAPI Backend on Your IPv4

Get your IPv4:

```sh
ipconfig
```

Example: `192.168.1.38`

Run backend:

```sh
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend is now available at:

```
http://192.168.x.x:8000
http://192.168.x.x:8000/docs   ← Swagger API UI
```

 **Must use IP, NOT 127.0.0.1**, otherwise the mobile app cannot connect.

---

# 📱 FRONTEND SETUP (REACT NATIVE)

##  1. Install Node Dependencies

```sh
npm install
```

---

## 2. Set API Base URL for Mobile App

Open:

```
src/api/axios.ts
```

Update base URL to your IPv4:

```ts
baseURL: "http://192.168.x.x:8000";
```

Every developer must set this to *their own* IPv4.

---

# RUNNING THE REACT NATIVE APP

## **STEP 1 → Start Metro (reset cache)**

```sh
npx react-native start --reset-cache
```

---

## **STEP 2 → Build & Run Android app (no second metro server)**

```sh
npx react-native run-android --no-packager
```

---

## Requirements

- Android Studio OR an Android phone with USB debugging enabled  
- Backend running on the same WiFi network  
- axios baseURL pointing to the backend IPv4  

---

# TESTING

###  Swagger API Docs
```
http://192.168.x.x:8000/docs
```

You can test:

- Signup
- Login
- Create Expenses
- Upload Receipts
- Create Trips
- Create Reports

---

# 🛠 COMMON ISSUES & FIXES

### **Network request failed**
**Cause:** Wrong API IP inside React Native.

Fix:

```
src/api/axios.ts
baseURL: "http://YOUR_IPV4:8000"
```

---

### **"Not authenticated"**
Backend was started using 127.0.0.1.

**Fix:** Always use:

```sh
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Data appears in backend but not in app
- You logged in with a different user.
- Token expired.
- Wrong IP in axios.ts.

---

# IMPORTANT FILES TO EDIT

| Purpose | File |
|---------|------|
| Backend DB settings | `backend/app/database.py` |
| Backend main router | `backend/app/main.py` |
| Frontend API URL | `src/api/axios.ts` |
| App data logic | `src/context/AppDataContext.tsx` |

---

# HOW OTHERS CAN RUN YOUR PROJECT

1. Clone repo  
2. Edit `src/api/axios.ts` → update IPv4  
3. Start MySQL & create `expeapp` DB  
4. Install backend deps & run FastAPI  
5. Install frontend deps  
6. Run:

```
npx react-native start --reset-cache
npx react-native run-android --no-packager
```

Done 

---
