
import React, { memo, useEffect } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';

interface EnclosureNodeData {
  label: string;
}

const EnclosureNode = ({ data, selected }: NodeProps<EnclosureNodeData>) => {
  return (
    <div className="flex items-center justify-center border-dashed border-2 border-gray-400 bg-gray-50/30">
      <NodeResizer 
        minWidth={100} 
        minHeight={100} 
        isVisible={selected} 
        lineStyle={{ border: '1px solid #2563eb' }}
        handleStyle={{ border: '1px solid #2563eb', background: '#fff' }}
      />
      <div className="text-gray-700">{data.label}</div>
    </div>
  );
};

export default memo(EnclosureNode);
