import React, { useState, useEffect, useRef } from "react";

// The main App component that manages state and page flow.
const App = () => {
  // State for the form inputs
  const [wallWidth, setWallWidth] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [pictureWidth, setPictureWidth] = useState("");
  const [pictureHeight, setPictureHeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [hangingHeight, setHangingHeight] = useState("");

  // State for the current page ('input', 'results', 'offsets')
  const [page, setPage] = useState("input");
  // State to store the calculation results
  const [layoutData, setLayoutData] = useState(null);
  // State for the custom alert/modal
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Function to handle the calculation and navigate to the results page
  const handleCalculate = () => {
    // Convert string inputs to numbers
    const parsedWallWidth = parseFloat(wallWidth);
    const parsedWallHeight = parseFloat(wallHeight);
    const parsedPictureWidth = parseFloat(pictureWidth);
    const parsedPictureHeight = parseFloat(pictureHeight);
    const parsedQuantity = parseInt(quantity);
    const parsedHangingHeight = parseFloat(hangingHeight);

    // Input validation
    if (
      isNaN(parsedWallWidth) ||
      parsedWallWidth <= 0 ||
      isNaN(parsedWallHeight) ||
      parsedWallHeight <= 0 ||
      isNaN(parsedPictureWidth) ||
      parsedPictureWidth <= 0 ||
      isNaN(parsedPictureHeight) ||
      parsedPictureHeight <= 0 ||
      isNaN(parsedQuantity) ||
      parsedQuantity < 1 ||
      isNaN(parsedHangingHeight) ||
      parsedHangingHeight <= 0 ||
      parsedHangingHeight > parsedWallHeight
    ) {
      setAlertMessage(
        "Please enter valid positive numbers. Hanging height must be less than or equal to wall height."
      );
      setShowAlert(true);
      return;
    }

    // Calculate total width of pictures
    const totalPicturesWidth = parsedPictureWidth * parsedQuantity;
    // Calculate total number of gaps (one at each end, and between each picture)
    const totalGaps = parsedQuantity + 1;
    // Calculate the width of each gap
    const gap = (parsedWallWidth - totalPicturesWidth) / totalGaps;

    if (gap < 0) {
      setAlertMessage(
        "The pictures are too wide to fit on the wall with spacing. Please adjust the sizes or quantity."
      );
      setShowAlert(true);
      return;
    }

    // Calculate the center x-coordinate for each picture
    const pictureCenters = Array.from(
      { length: parsedQuantity },
      (_, i) => gap * (i + 1) + parsedPictureWidth * (i + 0.5)
    );

    // Store the calculation results in state
    setLayoutData({
      wallWidth: parsedWallWidth,
      wallHeight: parsedWallHeight,
      pictureWidth: parsedPictureWidth,
      pictureHeight: parsedPictureHeight,
      quantity: parsedQuantity,
      hangingHeight: parsedHangingHeight,
      verticalOffsets: Array(parsedQuantity).fill(0), // Initialize all offsets to 0
      pictureCenters,
      gap,
    });
    setPage("results");
  };

  // Function to handle returning to the input page and resetting all state
  const handleReset = () => {
    setWallWidth("");
    setWallHeight("");
    setPictureWidth("");
    setPictureHeight("");
    setQuantity("");
    setHangingHeight("");
    setLayoutData(null);
    setPage("input");
  };

  // Function to navigate to the offsets page
  const goToOffsetsPage = () => {
    setPage("offsets");
  };

  // Function to handle applying offsets and returning to the results page
  const handleApplyOffsets = (newOffsets) => {
    setLayoutData((prevData) => ({
      ...prevData,
      verticalOffsets: newOffsets,
    }));
    setPage("results");
  };

  // Function to update a single offset value. This is useful for real-time updates.
  const updateOffset = (index, value) => {
    setLayoutData((prevData) => {
      const newOffsets = [...prevData.verticalOffsets];
      newOffsets[index] = value;
      return { ...prevData, verticalOffsets: newOffsets };
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-2xl bg-gray-900 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl md:text-5xl font-bold italic text-center p-2 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 drop-shadow-lg animate-pulse-shadow">
          Frame Hanger 9000
        </h1>

        {/* Custom Alert Modal */}
        {showAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm transition-all duration-300">
            <div className="bg-red-800 text-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
              <p className="text-lg font-semibold">{alertMessage}</p>
              <button
                onClick={() => setShowAlert(false)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-bold py-2 rounded-lg hover:scale-105 active:scale-95"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* Page 1: Input Form */}
        {page === "input" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Wall Width Input */}
              <Input
                label="Wall Width (in)"
                value={wallWidth}
                onChange={(e) => setWallWidth(e.target.value)}
                id="wallWidth"
              />

              {/* Wall Height Input */}
              <Input
                label="Wall Height (in)"
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                id="wallHeight"
              />

              {/* Picture Width Input */}
              <Input
                label="Picture Width (in)"
                value={pictureWidth}
                onChange={(e) => setPictureWidth(e.target.value)}
                id="pictureWidth"
              />

              {/* Picture Height Input */}
              <Input
                label="Picture Height (in)"
                value={pictureHeight}
                onChange={(e) => setPictureHeight(e.target.value)}
                id="pictureHeight"
              />

              {/* Quantity Input */}
              <div className="col-span-1 sm:col-span-2">
                <Input
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  id="quantity"
                />
              </div>

              {/* Hanging Height Input */}
              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="hangingHeight"
                  className="block text-lg font-medium text-gray-200 mb-1"
                >
                  Hanging Height (in)
                  <br />
                  <span className="text-sm font-normal text-gray-400">
                    (Distance from floor to{" "}
                    <strong className="text-cyan-400">top</strong> of picture)
                  </span>
                </label>
                <input
                  type="number"
                  id="hangingHeight"
                  value={hangingHeight}
                  onChange={(e) => setHangingHeight(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 text-lg"
                />
              </div>
            </div>
            <button
              onClick={handleCalculate}
              className="w-full mt-8 p-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-900/50 transition-all duration-300 active:scale-95 hover:scale-105"
            >
              Calculate Layout
            </button>
          </div>
        )}

        {/* Page 2: Results */}
        {page === "results" && layoutData && (
          <div className="animate-fade-in">
            <Results
              layoutData={layoutData}
              onGoBack={handleReset}
              onGoToOffsets={goToOffsetsPage}
            />
          </div>
        )}

        {/* Page 3: Offsets */}
        {page === "offsets" && layoutData && (
          <div className="animate-fade-in">
            <Offsets
              layoutData={layoutData}
              onApplyOffsets={handleApplyOffsets}
              updateOffset={updateOffset}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input component for a cleaner form
const Input = ({ label, value, onChange, id }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-lg font-medium text-gray-200 mb-1"
    >
      {label}
    </label>
    <input
      type="number"
      id={id}
      value={value}
      onChange={onChange}
      placeholder="0"
      className="w-full px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 text-lg"
    />
  </div>
);

// Component for Page 2 (Results)
const Results = ({ layoutData, onGoBack, onGoToOffsets }) => {
  const canvasRef = useRef(null);
  const {
    wallWidth,
    wallHeight,
    pictureWidth,
    pictureHeight,
    quantity,
    hangingHeight,
    verticalOffsets,
    pictureCenters,
    gap,
  } = layoutData;

  // UseEffect hook for drawing the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const drawLayout = () => {
      // Set canvas dimensions based on container width
      const containerWidth = canvas.parentNode.clientWidth;
      const padding = 20;
      canvas.width = containerWidth;

      // Calculate scaling factor
      const scale = (canvas.width - padding * 2) / wallWidth;
      canvas.height = wallHeight * scale + 120; // Extra space for labels below

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Draw Wall Outline ---
      ctx.strokeStyle = "#374151"; // Gray-700
      ctx.lineWidth = 4;
      ctx.strokeRect(padding, padding, wallWidth * scale, wallHeight * scale);

      // --- Draw Grid on Wall ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      // Vertical lines
      for (let i = 0; i <= wallWidth; i += 10) {
        ctx.beginPath();
        ctx.moveTo(padding + i * scale, padding);
        ctx.lineTo(padding + i * scale, padding + wallHeight * scale);
        ctx.stroke();
      }
      // Horizontal lines
      for (let i = 0; i <= wallHeight; i += 10) {
        ctx.beginPath();
        ctx.moveTo(padding, padding + i * scale);
        ctx.lineTo(padding + wallWidth * scale, padding + i * scale);
        ctx.stroke();
      }

      // --- Draw Hanging Height Reference Line ---
      const hangingY = padding + (wallHeight - hangingHeight) * scale;
      ctx.strokeStyle = "#06B6D4"; // Cyan-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, hangingY);
      ctx.lineTo(padding + wallWidth * scale, hangingY);
      ctx.stroke();

      // Hanging height text
      ctx.fillStyle = "#06B6D4"; // Cyan-500
      ctx.font = "16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        `Hanging Height: ${hangingHeight.toFixed(2)}"`,
        padding + 10,
        hangingY - 10
      );

      // --- Draw Pictures ---
      for (let i = 0; i < quantity; i++) {
        const center = pictureCenters[i];
        const offset = verticalOffsets[i];
        const x = padding + (center - pictureWidth / 2) * scale;
        // Calculate y position based on hanging height and offset
        const y = padding + (wallHeight - (hangingHeight + offset)) * scale;

        // Use HSL for dynamic, distinct picture colors
        const color = `hsl(${i * 45 + 200}, 70%, 60%)`; // Cooler color palette

        // Draw picture rectangle
        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 8;
        ctx.fillRect(x, y, pictureWidth * scale, pictureHeight * scale);
        ctx.shadowBlur = 0;

        // Label picture number inside
        ctx.fillStyle = "#111";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `P${i + 1}`,
          x + (pictureWidth * scale) / 2,
          y + (pictureHeight * scale) / 2 + 5
        );

        // --- Draw Center Mark and Label ---
        const centerX = padding + center * scale;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, padding + wallHeight * scale + 10);
        ctx.lineTo(centerX, padding + wallHeight * scale + 20);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${center.toFixed(2)}"`,
          centerX,
          padding + wallHeight * scale + 35
        );
      }

      // --- Draw Gap Lines and Labels ---
      const gapY = padding + wallHeight * scale + 60;
      ctx.strokeStyle = "#A1A1AA"; // Gray-400
      ctx.lineWidth = 1;
      ctx.fillStyle = "#A1A1AA";

      // Left gap
      const leftGapEnd = padding + gap * scale;
      ctx.beginPath();
      ctx.moveTo(padding, gapY);
      ctx.lineTo(leftGapEnd, gapY);
      ctx.stroke();
      ctx.fillText(
        `Gap: ${gap.toFixed(2)}"`,
        (padding + leftGapEnd) / 2,
        gapY - 10
      );

      // Gaps between pictures
      if (quantity > 1) {
        for (let i = 0; i < quantity - 1; i++) {
          const gapStartX =
            padding + (pictureCenters[i] + pictureWidth / 2) * scale;
          const gapEndX =
            padding + (pictureCenters[i + 1] - pictureWidth / 2) * scale;
          ctx.beginPath();
          ctx.moveTo(gapStartX, gapY);
          ctx.lineTo(gapEndX, gapY);
          ctx.stroke();
          ctx.fillText(
            `Gap: ${gap.toFixed(2)}"`,
            (gapStartX + gapEndX) / 2,
            gapY - 10
          );
        }
      }

      // Right gap
      const rightGapStart = padding + (wallWidth - gap) * scale;
      ctx.beginPath();
      ctx.moveTo(rightGapStart, gapY);
      ctx.lineTo(padding + wallWidth * scale, gapY);
      ctx.stroke();
      ctx.fillText(
        `Gap: ${gap.toFixed(2)}"`,
        (rightGapStart + padding + wallWidth * scale) / 2,
        gapY - 10
      );

      // Draw tick marks for the gap lines
      const drawTick = (x, y) => {
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.stroke();
      };

      drawTick(padding, gapY);
      drawTick(leftGapEnd, gapY);
      if (quantity > 1) {
        for (let i = 0; i < quantity - 1; i++) {
          drawTick(
            padding + (pictureCenters[i] + pictureWidth / 2) * scale,
            gapY
          );
          drawTick(
            padding + (pictureCenters[i + 1] - pictureWidth / 2) * scale,
            gapY
          );
        }
      }
      drawTick(rightGapStart, gapY);
      drawTick(padding + wallWidth * scale, gapY);
    };

    // Initial draw and on window resize
    drawLayout();
    window.addEventListener("resize", drawLayout);
    return () => window.removeEventListener("resize", drawLayout);
  }, [layoutData]); // Redraw when layoutData changes

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Canvas for the visual representation */}
        <canvas
          ref={canvasRef}
          className="w-full bg-gray-800 rounded-xl shadow-inner-lg mt-4 border-2 border-gray-700"
        ></canvas>
      </div>

      {/* Calculated Output */}
      <div className="mt-8 p-4 bg-gray-800 rounded-xl shadow-inner-lg border-2 border-gray-700">
        <h3 className="text-xl font-bold text-gray-200 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
          Calculations
        </h3>
        <p className="text-lg font-medium text-gray-300">
          Evenly distributed gap between pictures:{" "}
          <span className="font-bold text-cyan-400">{gap.toFixed(2)}"</span>
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pictureCenters.map((center, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span
                className={`text-lg font-bold`}
                style={{ color: `hsl(${i * 45 + 200}, 70%, 60%)` }}
              >
                Picture {i + 1} Center:
              </span>
              <span className="text-lg text-gray-300">
                {center.toFixed(2)}"
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
        <button
          onClick={onGoBack}
          className="w-full p-4 rounded-xl text-lg font-semibold bg-gray-700 text-white shadow-lg shadow-gray-900/50 hover:bg-gray-600 transition-all duration-300 active:scale-95 hover:scale-105"
        >
          Reset & Go Back
        </button>
        <button
          onClick={onGoToOffsets}
          className="w-full p-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-900/50 transition-all duration-300 active:scale-95 hover:scale-105"
        >
          Apply Offsets
        </button>
      </div>
    </>
  );
};

// Component for Page 3 (Offsets)
const Offsets = ({ layoutData, onApplyOffsets, updateOffset }) => {
  const { quantity, verticalOffsets } = layoutData;
  const [currentOffsets, setCurrentOffsets] = useState(verticalOffsets);

  // This effect ensures the offsets are in sync if we go back and forth between pages
  useEffect(() => {
    setCurrentOffsets(verticalOffsets);
  }, [verticalOffsets]);

  const handleInputChange = (e, index) => {
    const value = parseFloat(e.target.value) || 0;
    const newOffsets = [...currentOffsets];
    newOffsets[index] = value;
    setCurrentOffsets(newOffsets);
    // Also update the global state so canvas on page 2 updates in real-time
    updateOffset(index, value);
  };

  const handleInputFocus = (e, index) => {
    // If the value is 0, clear the input field on focus
    if (currentOffsets[index] === 0) {
      const newOffsets = [...currentOffsets];
      newOffsets[index] = "";
      setCurrentOffsets(newOffsets);
    }
  };

  return (
    <>
      <div className="p-4 bg-gray-800 rounded-xl shadow-inner-lg border-2 border-gray-700">
        <h3 className="text-xl font-bold text-gray-200 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
          Vertical Offsets
        </h3>
        <p className="text-gray-400 mb-4">
          Enter a value to adjust each picture's height.
          <br />
          <strong className="text-emerald-400">+</strong> for up,{" "}
          <strong className="text-red-400">-</strong> for down.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: quantity }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <label
                htmlFor={`offset-${i}`}
                className="text-gray-200 font-medium"
              >
                P{i + 1}
              </label>
              <input
                id={`offset-${i}`}
                type="number"
                value={currentOffsets[i]}
                onChange={(e) => handleInputChange(e, i)}
                onFocus={(e) => handleInputFocus(e, i)}
                placeholder="0"
                className="mt-1 w-full px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 text-lg"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => onApplyOffsets(currentOffsets)}
        className="w-full mt-8 p-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-900/50 transition-all duration-300 active:scale-95 hover:scale-105"
      >
        Apply Offsets & Return
      </button>
    </>
  );
};

export default App;
