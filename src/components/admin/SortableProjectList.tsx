"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMove, FiStar } from "react-icons/fi";
import type { Project } from "@/types";

interface SortableProjectListProps {
  projects: Project[];
  onReorder: (projectIds: string[]) => Promise<void>;
  onCancel: () => void;
}

interface SortableProjectItemProps {
  project: Project;
}

function SortableProjectItem({ project }: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-background/50 border border-foreground/10 rounded-lg ${
        isDragging ? "opacity-50 shadow-lg z-50" : ""
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-2 cursor-grab active:cursor-grabbing text-foreground/50 hover:text-foreground/80 transition-colors touch-none"
        aria-label="Drag to reorder"
      >
        <FiMove className="w-5 h-5" />
      </button>

      {/* Project Thumbnail */}
      {project.images[0] && (
        <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-foreground/5">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">
            {project.title}
          </h3>
          {project.featured && (
            <FiStar className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-foreground/60 truncate">{project.category}</p>
      </div>

      {/* Order Number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium text-foreground/70">
        {typeof project.order === "number" ? project.order + 1 : "-"}
      </div>
    </div>
  );
}

export function SortableProjectList({
  projects,
  onReorder,
  onCancel,
}: SortableProjectListProps) {
  const [items, setItems] = useState(projects);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const orderedIds = items.map((item) => item.id);
      await onReorder(orderedIds);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-500">
          Drag and drop projects to reorder them. Click &quot;Save Order&quot; when done.
        </p>
      </div>

      {/* Sortable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((project) => (
              <SortableProjectItem key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-foreground/10">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Order"}
        </button>
      </div>
    </div>
  );
}
