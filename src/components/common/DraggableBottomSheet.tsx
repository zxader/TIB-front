// src/components/common/DraggableBottomSheet.tsx
import { useEffect, ReactNode } from "react";
import { useBottomSheet } from "@/hooks";

interface DraggableBottomSheetProps {
  header?: ReactNode;
  children?: ReactNode;
  initialState?: "min" | "middle" | "max";
}

export const DraggableBottomSheet = ({
  header,
  children,
  initialState = "middle",
}: DraggableBottomSheetProps) => {
  const { state, currentHeight, isDragging, handlers } = useBottomSheet(initialState);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handlers.onMouseMove({ clientY: e.clientY } as React.MouseEvent);
    };

    const handleMouseUp = () => {
      handlers.onMouseUp();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handlers]);

  return (
    <div
      className={`fixed left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 transition-all duration-300 ease-out overflow-hidden ${
        state === "max" ? "bottom-0" : "bottom-12"
      }`}
      style={{ height: currentHeight }}>
      {/* 드래그 핸들 */}
      <div
        className="w-full py-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handlers.onMouseDown}
        onTouchStart={handlers.onTouchStart}
        onTouchMove={handlers.onTouchMove}
        onTouchEnd={handlers.onTouchEnd}>
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
      </div>

      {/* 헤더 영역 */}
      {header && <div className="px-5 pb-3">{header}</div>}

      {/* 컨텐츠 영역 */}
      {children && (state === "middle" || state === "max") && (
        <div
          className={`px-5 ${state === "max" ? "overflow-y-auto" : "overflow-hidden"}`}
          style={{ height: state === "max" ? "calc(100% - 120px)" : "150px" }}>
          {children}
        </div>
      )}
    </div>
  );
};
