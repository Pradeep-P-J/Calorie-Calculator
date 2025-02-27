import React from 'react';
import './Header.css'; // Import the corresponding CSS file for the header

export const Header = () => {
  return (
    <div>
      <div className='Home'>
        <h3 className='myfit'>@myfitnesspal</h3>
        <div className="nutrition">
          <h4>#1 nutrition tracking app</h4>
          <h1>Nutrition tracking for <span>real life</span></h1>
        </div>
        <p>Make progress with the all-in-one-food, exercise, and calorie tracker.</p>
        {/* <img
          src='https://www.myfitnesspal.com/_next/image?url=%2Fpages%2Fhome%2Flogged-out-v2%2Fhero-phone-large.png&w=640&q=75'
          alt='Nutrition tracking'
        /> */}
      </div>
    </div>
  );
};
