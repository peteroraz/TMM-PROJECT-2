import React from 'react';
import type { MarketingScene } from '../types';

interface SceneSelectorProps {
  scenes: MarketingScene[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({ scenes, selectedIds, onSelectionChange }) => {
  const handleToggle = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((sceneId) => sceneId !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelectedIds);
  };

  const handleSelectAll = () => {
    onSelectionChange(scenes.map(s => s.id));
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const allSelected = selectedIds.length === scenes.length;

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">2. Select Scenes</h2>
        <button 
            onClick={allSelected ? handleDeselectAll : handleSelectAll}
            className="text-sm font-medium text-brand-primary hover:text-blue-700 focus:outline-none focus:underline"
        >
            {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {scenes.map((scene) => (
          <div key={scene.id}>
            <input
              type="checkbox"
              id={`scene-${scene.id}`}
              value={scene.id}
              className="sr-only peer"
              checked={selectedIds.includes(scene.id)}
              onChange={() => handleToggle(scene.id)}
            />
            <label
              htmlFor={`scene-${scene.id}`}
              className="flex items-center justify-center text-center w-full p-3 text-gray-600 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100 peer-checked:border-brand-primary peer-checked:text-brand-primary transition-colors duration-200"
            >
              <span className="text-sm font-semibold">{scene.title}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SceneSelector;
