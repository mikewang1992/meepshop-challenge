import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  BUTTON: "button",
};

const DraggableButton = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BUTTON,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "10px",
        border: "1px solid black",
        marginBottom: "10px",
        backgroundColor: "#f0f0f0",
      }}
    >
      {label}
    </div>
  );
};

const DroppableArea = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BUTTON,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        width: "100%",
        height: "100%",
        border: "2px dashed #ddd",
        backgroundColor: isOver ? "#f7f7f7" : "white",
      }}
    >
      {children}
    </div>
  );
};

const DragDropApp = () => {
  const [components, setComponents] = useState([]);

  const handleDrop = (item) => {
    if (item.type === "image" || item.type === "text") {
      setComponents((prev) => [
        ...prev,
        item.type === "image" ? { type: "image", src: "" } : { type: "text" },
      ]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "20%",
            padding: "10px",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <DraggableButton type="image" label="Image Component" />
          <DraggableButton type="text" label="Text Component" />
        </div>

        <div style={{ flex: 1, padding: "10px" }}>
          <DroppableArea onDrop={handleDrop}>
            {components.map((component, index) => (
              <div
                key={index}
                style={{
                  margin: "10px",
                  padding: "10px",
                  border: "1px solid black",
                }}
              >
                {component.type === "image" ? (
                  <ImageComponent src={component.src} />
                ) : (
                  <TextComponent />
                )}
              </div>
            ))}
          </DroppableArea>
        </div>
      </div>
    </DndProvider>
  );
};

const ImageComponent = () => {
  const [imgSrc, setImgSrc] = useState("https://picsum.photos/300/300"); // Default
  const [width, setWidth] = useState("300");
  const [height, setHeight] = useState("300");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {/* Image preview */}
      <img
        src={imgSrc}
        alt="Preview"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
        onClick={() => setIsEditing(!isEditing)}
      />

      {isEditing && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Image URL: </label>
            <input
              type="text"
              value={imgSrc}
              onChange={(e) => setImgSrc(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label>Width: </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              style={{ width: "100px", marginRight: "10px" }}
            />
            <label>Height: </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={{ width: "100px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TextComponent = () => {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <p>{text}</p>
    </div>
  );
};

export default DragDropApp;
