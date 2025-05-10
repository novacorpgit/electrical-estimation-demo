
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface ComponentNodeData {
  label: string;
  color: string;
  bomItemId: string;
}

const ComponentNode = ({ data }: NodeProps<ComponentNodeData>) => {
  return (
    <div className="flex items-center justify-center p-2" style={{ backgroundColor: data.color, color: '#fff' }}>
      <div className="font-semibold text-center">{data.label}</div>
    </div>
  );
};

export default memo(ComponentNode);
