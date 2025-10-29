# 🎮 Veilcy Cloner - Usage Guide

## ✅ Features Added

### **Interactive Button System**
- ✅ **Yes** / ❌ **No** reaction buttons for confirmation
- 60-second timeout for responses
- Two-step confirmation process
- Clean and intuitive interface

---

## 📝 How to Use

### **Step 1: Setup**
1. Install dependencies:
   ```powershell
   npm install
   ```

2. Configure `.env` file:
   ```env
   TOKEN=your_discord_token_here
   ALLOWED_USER_IDS=your_user_id_here
   ```

3. Start the bot:
   ```powershell
   node index.js
   ```

---

### **Step 2: Clone Command**

Discord channel mein command type karein:

```
!clone <source_server_id> <target_server_id>
```

**Example:**
```
!clone 123456789012345678 987654321098765432
```

---

### **Step 3: Confirmation Process**

#### **First Confirmation:**
Bot ek message bhejega with:
- Source server name
- Target server name
- Warning message

**React with:**
- ✅ **Yes** - Proceed karne ke liye
- ❌ **No** - Cancel karne ke liye

#### **Second Confirmation:**
Agar aapne ✅ **Yes** click kiya, toh bot puchega:

**"Clone Emojis?"**

**React with:**
- ✅ **Yes** - Emojis bhi clone honge
- ❌ **No** - Sirf channels aur roles clone honge

---

### **Step 4: Cloning Process**

Bot automatically:
1. ✅ Delete existing content from target server
2. ✅ Clone all roles
3. ✅ Clone all categories
4. ✅ Clone all channels (text & voice)
5. ✅ Clone emojis (if selected)
6. ✅ Copy server info

---

## ⚠️ Important Notes

### **Warnings:**
- 🚨 This is a **selfbot** - Against Discord TOS
- 🚨 Account **ban** ho sakta hai
- 🚨 Target server ka **sab kuch delete** hoga
- 🚨 Backup zaroor rakhein

### **Requirements:**
- ✅ Bot ko **admin permissions** chahiye target server mein
- ✅ Aap **member** hone chahiye dono servers mein
- ✅ Rate limits se bachne ke liye **slow cloning** hoti hai

### **Timeout:**
- ⏱️ Har confirmation ke liye **60 seconds** milte hain
- ⏱️ Time out hone par operation **auto-cancel** ho jata hai

---

## 🎯 Example Flow

```
User: !clone 123456789012345678 987654321098765432

Bot: 📋 Server Cloning Confirmation
     - Source: My Awesome Server
     - Target: Test Server
     
     ⚠️ Warning: This will delete all existing channels and roles!
     
     Do you want to proceed?
     React with ✅ for Yes or ❌ for No

User: [Clicks ✅]

Bot: ❓ Clone Emojis?
     
     Do you want to clone emojis as well?
     React with ✅ for Yes or ❌ for No

User: [Clicks ✅]

Bot: 🚀 Starting server cloning process... (including emojis)
     🗑️ Deleting existing content...
     👑 Cloning roles...
     📁 Cloning categories...
     📝 Cloning channels...
     😀 Cloning emojis...
     🎉 Server cloning completed successfully!
```

---

## 🆘 Troubleshooting

### **Bot not responding?**
- ✅ Check if TOKEN is correct in `.env`
- ✅ Check if your USER_ID is in ALLOWED_USER_IDS
- ✅ Make sure bot is logged in

### **"Server not found" error?**
- ✅ Bot ko server member hona chahiye
- ✅ Server ID check karein (right-click > Copy ID)
- ✅ Developer Mode enable ho Discord mein

### **"Permission denied" error?**
- ✅ Bot ko administrator permission chahiye
- ✅ Target server owner access helpful hai

### **Reaction buttons not working?**
- ✅ Make sure aap authorized user ho
- ✅ 60 seconds ke andar react karein
- ✅ Sirf ✅ ya ❌ react karein

---

## 🔧 Advanced Configuration

### **Custom Timeout:**
`messageHandler.js` mein `time: 60000` change karein (milliseconds)

### **Custom Emojis:**
Reaction emojis ko customize karne ke liye emoji names change karein

---

## 📞 Support

Koi issue ho toh:
1. Console logs check karein
2. Error messages padhein carefully
3. `.env` file recheck karein

---

**Made with ❤️ for server management**
