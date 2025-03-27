import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "./LoginPage";
import { Header } from "./Header";

// Define a color palette
const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  dark: "#292F36",
  light: "#F7FFF7",
  success: "#6BFF7C",
  warning: "#FFD166"
};

const CalorieCounter = () => {
  const initialFoodList = [
    { name: "Chappathi", calories: 130, color: colors.primary },
    { name: "Idly", calories: 75, color: colors.secondary },
    { name: "Briyani", calories: 350, color: colors.accent },
    { name: "Egg", calories: 68, color: colors.success },
    { name: "Rice (1 cup)", calories: 200, color: colors.warning },
  ];

  const [foodList, setFoodList] = useState(initialFoodList);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", calories: 0 });
  const [totalCalories, setTotalCalories] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [tempCalorieGoal, setTempCalorieGoal] = useState(2000);
  const [addingFood, setAddingFood] = useState(false);
  const [settingGoal, setSettingGoal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateHistory, setDateHistory] = useState({});
  
  // Generate 14 days (2 weeks) for calendar
  const getCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = -7; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  useEffect(() => {
    // Load data for the selected date
    const dateKey = selectedDate.toDateString();
    if (dateHistory[dateKey]) {
      setSelectedFoods(dateHistory[dateKey].foods || []);
      setCalorieGoal(dateHistory[dateKey].goal || 2000);
      setTempCalorieGoal(dateHistory[dateKey].goal || 2000);
    } else {
      setSelectedFoods([]);
      setTotalCalories(0);
    }
  }, [selectedDate]);

  useEffect(() => {
    calculateTotalCalories();
    
    // Save the current state to the date history
    const dateKey = selectedDate.toDateString();
    setDateHistory(prev => ({
      ...prev,
      [dateKey]: {
        foods: selectedFoods,
        total: totalCalories,
        goal: calorieGoal
      }
    }));
  }, [selectedFoods, calorieGoal]);

  const handleAddFood = () => {
    if (newFood.name && newFood.calories > 0) {
      const randomColor = [colors.primary, colors.secondary, colors.accent, colors.success, colors.warning][
        Math.floor(Math.random() * 5)
      ];
      
      setFoodList([...foodList, {...newFood, color: randomColor}]);
      setNewFood({ name: "", calories: 0 });
      setAddingFood(false);
    }
  };

  const handleFoodSelect = (food, quantity) => {
    const updatedFood = { 
      ...food, 
      quantity, 
      totalCalories: food.calories * quantity 
    };
    
    const existingFoodIndex = selectedFoods.findIndex((item) => item.name === food.name);

    if (existingFoodIndex !== -1) {
      const updatedFoods = [...selectedFoods];
      if (quantity <= 0) {
        updatedFoods.splice(existingFoodIndex, 1);
      } else {
        updatedFoods[existingFoodIndex] = updatedFood;
      }
      setSelectedFoods(updatedFoods);
    } else if (quantity > 0) {
      setSelectedFoods([...selectedFoods, updatedFood]);
    }
  };

  const calculateTotalCalories = () => {
    const calories = selectedFoods.reduce((sum, food) => sum + food.totalCalories, 0);
    setTotalCalories(calories);
  };

  const getCaloriePercentage = () => {
    return Math.min((totalCalories / calorieGoal) * 100, 100);
  };

  const getCalorieColor = () => {
    const percentage = getCaloriePercentage();
    if (percentage < 50) return colors.success;
    if (percentage < 85) return colors.warning;
    return colors.primary;
  };

  const saveCalorieGoal = () => {
    setCalorieGoal(parseInt(tempCalorieGoal));
    setSettingGoal(false);
    
    // Update goal in date history
    const dateKey = selectedDate.toDateString();
    setDateHistory(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        goal: parseInt(tempCalorieGoal)
      }
    }));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getDayProgress = (date) => {
    const dateKey = date.toDateString();
    if (dateHistory[dateKey]) {
      const { total, goal } = dateHistory[dateKey];
      return Math.min((total || 0) / (goal || 2000) * 100, 100);
    }
    return 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="app-container"
      style={{ 
        background: `linear-gradient(135deg, ${colors.light} 0%, #e0f7fa 100%)`,
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <Header />
      
      <motion.h1 
        className="title"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ 
          color: colors.dark,
          textAlign: "center",
          marginBottom: "30px",
          position: "relative"
        }}
      >
        Calorie Counter
        <motion.span 
          style={{ 
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            width: "100px",
            height: "4px",
            background: colors.primary,
            borderRadius: "2px",
          }}
          initial={{ width: 0, left: "50%" }}
          animate={{ width: "100px", left: "calc(50% - 50px)" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </motion.h1>

      {/* Calendar Bar */}
      <motion.div 
        className="calendar-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "white",
          borderRadius: "15px",
          padding: "15px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "1200px",
          margin: "0 auto 30px"
        }}
      >
        <h3 style={{ margin: "0 0 15px", color: colors.dark }}>Your Progress</h3>
        <div style={{ 
          display: "flex", 
          overflowX: "auto", 
          gap: "10px", 
          padding: "5px 0",
          scrollbarWidth: "thin",
        }}>
          {calendarDays.map((date, index) => (
            <motion.div
              key={date.toDateString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => setSelectedDate(date)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                minWidth: "60px",
                padding: "10px 5px",
                borderRadius: "10px",
                background: date.toDateString() === selectedDate.toDateString() ? 
                  `${colors.secondary}30` : "transparent",
                border: date.toDateString() === selectedDate.toDateString() ? 
                  `2px solid ${colors.secondary}` : "2px solid transparent",
              }}
            >
              <div style={{ 
                marginBottom: "5px", 
                fontWeight: isToday(date) ? "bold" : "normal",
                color: isToday(date) ? colors.primary : colors.dark
              }}>
                {formatDate(date)}
              </div>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                position: "relative",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: colors.dark
              }}>
                <svg width="40" height="40" style={{ position: "absolute" }}>
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke={getDayProgress(date) > 0 ? getCalorieColor() : "#ddd"}
                    strokeWidth="4"
                    strokeDasharray="113"
                    strokeDashoffset={113 - (113 * getDayProgress(date) / 100)}
                    transform="rotate(-90 20 20)"
                  />
                </svg>
                <div>{isToday(date) ? "Today" : `Day ${index + 1}`}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="dashboard-container" style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: "30px",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px"
      }}>
        <motion.div 
          className="selected-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={selectedDate.toDateString()}
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: colors.dark
          }}
        >
          {selectedDate.toDateString()}
        </motion.div>
        
        <motion.div 
          className="calorie-meter"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "#f5f5f5",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
        >
          <motion.div 
            className="meter-fill"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: getCaloriePercentage() / 100 }}
            transition={{ duration: 1, type: "spring" }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
          >
            <svg width="200" height="200" style={{ position: "absolute" }}>
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke={getCalorieColor()}
                strokeWidth="15"
                strokeDasharray="534"
                strokeDashoffset={534 - (534 * getCaloriePercentage() / 100)}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 0.5s" }}
              />
            </svg>
          </motion.div>
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <h2 style={{ margin: 0, color: getCalorieColor(), fontSize: "36px", fontWeight: "bold" }}>
                {totalCalories}
              </h2>
              <p style={{ margin: "5px 0 0", color: colors.dark, fontSize: "14px" }}>
                of {calorieGoal} kcal
              </p>
            </motion.div>
          </div>
        </motion.div>

        {!settingGoal ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSettingGoal(true)}
            style={{
              background: colors.dark,
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <span>Set Daily Goal</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <motion.input
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              type="number"
              value={tempCalorieGoal}
              onChange={(e) => setTempCalorieGoal(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: `2px solid ${colors.secondary}`,
                textAlign: "center",
                fontWeight: "bold"
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveCalorieGoal}
              style={{
                background: colors.success,
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTempCalorieGoal(calorieGoal);
                setSettingGoal(false);
              }}
              style={{
                background: "#f5f5f5",
                color: "#777",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Cancel
            </motion.button>
          </motion.div>
        )}
      </div>

      <div className="container" style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <motion.div 
          className="food-list"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ color: colors.dark, marginTop: 0 }}>Select Food Items</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <AnimatePresence>
              {foodList.map((food, index) => (
                <motion.li 
                  key={food.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ marginBottom: "10px" }}
                >
                  <motion.div 
                    className="food-item"
                    whileHover={{ scale: 1.02 }}
                    style={{ 
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 15px",
                      borderRadius: "10px",
                      background: `linear-gradient(90deg, ${food.color}30 0%, white 100%)`,
                      border: `2px solid ${food.color}50`,
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold", color: colors.dark }}>{food.name}</span>
                      <span style={{ display: "block", fontSize: "14px", color: "#777" }}>{food.calories} kcal</span>
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.05 }}
                      type="number"
                      placeholder="Qty"
                      min="0"
                      onChange={(e) => handleFoodSelect(food, parseInt(e.target.value) || 0)}
                      style={{ 
                        width: "60px",
                        padding: "8px",
                        borderRadius: "8px",
                        border: `2px solid ${food.color}80`,
                        outline: "none",
                        textAlign: "center"
                      }}
                    />
                  </motion.div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

        <motion.div 
          className="tracking-section"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <motion.div 
            className="add-food"
            style={{ 
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            <h2 style={{ color: colors.dark, marginTop: 0 }}>Add Custom Food</h2>
            
            {!addingFood ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAddingFood(true)}
                style={{
                  background: colors.secondary,
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  width: "100%"
                }}
              >
                + Add New Food
              </motion.button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <motion.input
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      type="text"
                      placeholder="Food Name"
                      value={newFood.name}
                      onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      style={{ 
                        padding: "10px",
                        borderRadius: "8px",
                        border: `2px solid ${colors.secondary}50`,
                        outline: "none"
                      }}
                    />
                    <motion.input
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      type="number"
                      placeholder="Calories"
                      value={newFood.calories || ""}
                      onChange={(e) => setNewFood({ ...newFood, calories: parseInt(e.target.value) || 0 })}
                      style={{ 
                        padding: "10px",
                        borderRadius: "8px",
                        border: `2px solid ${colors.secondary}50`,
                        outline: "none"
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddFood}
                        style={{
                          flex: 1,
                          background: colors.success,
                          color: "white",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        Add Food
                      </motion.button>
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setAddingFood(false);
                          setNewFood({ name: "", calories: 0 });
                        }}
                        style={{
                          flex: 1,
                          background: "#f5f5f5",
                          color: "#777",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          <motion.div 
            className="selected-foods"
            style={{ 
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              flex: 1
            }}
          >
            <h2 style={{ color: colors.dark, marginTop: 0 }}>Selected Foods</h2>
            {selectedFoods.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: "#777", textAlign: "center", padding: "20px" }}
              >
                No foods selected yet. Start by adding quantities to the food items.
              </motion.p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                <AnimatePresence>
                  {selectedFoods.map((food, index) => (
                    <motion.li 
                      key={food.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ marginBottom: "10px" }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ 
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 15px",
                          borderRadius: "10px",
                          background: `linear-gradient(90deg, ${food.color || colors.primary}20 0%, white 100%)`,
                          border: `2px solid ${food.color || colors.primary}40`
                        }}
                      >
                        <span style={{ fontWeight: "bold", color: colors.dark }}>{food.name}</span>
                        <span>
                          <span style={{ color: "#777" }}>{food.quantity} x {food.calories} = </span>
                          <span style={{ color: food.color || colors.primary, fontWeight: "bold" }}>{food.totalCalories} kcal</span>
                        </span>
                      </motion.div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
            
            <motion.div 
              className="total-calories"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ 
                marginTop: "20px",
                padding: "15px",
                borderRadius: "10px",
                background: colors.dark,
                color: "white",
                textAlign: "center"
              }}
            >
              <h3 style={{ margin: 0 }}>Total Calories</h3>
              <motion.p
                key={totalCalories}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                style={{ 
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "5px 0 0",
                  color:"gold"
                }}
              >
                {totalCalories} kcal
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/calorie-counter"
          element={isLoggedIn ? <CalorieCounter /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <CalorieCounter /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/signup" 
          element={<SignUpPage />} 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPasswordPage />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/calorie-counter" 
          element={
            isLoggedIn ? (
              <CalorieCounterPage />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Redirect root to login page */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />

        {/* Catch-all route for 404 */}
        <Route 
          path="*" 
          element={<Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;